# Deterministic CurseForge publication

## Policy and support boundary

`curseforge-project.json` is the reviewed policy, not a release discovery service.
It pins historical project **1703803**, current version **1.9.0**, the NeoForge mod
ID, exact JAR path, required dependencies, and version selectors. An optional
`--project-id` asserts that policy; it cannot override it. Confirm ownership/project
identity in the CurseForge author dashboard before the first publication. No
ownership query or remote file status has been invented. No version bump is made.

The official CurseForge Upload API reference used for the implementation is:
https://support.curseforge.com/en/support/solutions/articles/9000197321-curseforge-upload-api

The implementation uses its documented author `GET /api/game/versions`, multipart
`POST /api/projects/{projectId}/upload-file`, and metadata-only
`POST /api/projects/{projectId}/update-file`. Authentication uses only
`X-Api-Token`. `gameVersions` contains numeric IDs; relations are nested under
`relations.projects` and use string dependency types. Upload includes `metadata`
and `file`; update includes only `metadata`, with explicit numeric `fileID`.
A successful response must include a positive numeric `id`; updates must return
the exact requested ID. This CLI intentionally accepts a strict subset of optional
API fields; unknown fields are refused instead of silently forwarded.

Python **3.11+**, Git and POSIX `flock` are required; the publisher has no pip
dependencies, AI runtime, curl/jq dependency or automatic retry library. It is a
manifest-driven publisher for this NeoForge descriptor/build convention, reusable
for other projects using that convention. Other build formats require an explicit
validator extension rather than bypassing artifact validation.

## Credentials and commands (local or Hermes)

Run from the repository root. A trusted environment/secret manager must supply
`CURSEFORGE_API_KEY` (or legacy `CF_API_KEY`); never paste a token into a command,
argument, changelog, file or chat. Both env names set to different values is an
error. Preflight and status need no token. Plan needs a token for its GET only.
No config files, vault entries or secret files are read by the publisher.

```sh
python3 -m unittest discover -s tests -v
python3 -m py_compile scripts/curseforge_publish.py tests/test_curseforge_publish.py

# After the maintainer commits changes and creates/checks out the matching tag:
python3 scripts/curseforge_publish.py preflight --tag v1.9.0
python3 scripts/curseforge_publish.py plan --tag v1.9.0
python3 scripts/curseforge_publish.py upload --tag v1.9.0 --dry-run
python3 scripts/curseforge_publish.py status
```

`preflight` is entirely offline and checks clean tracked source, tag->HEAD,
manifest/build version agreement, source dependency mapping, expected JAR filename,
ZIP integrity and duplicate/unsafe members, expanded ZIP size, built mod ID/version,
dependencies and SHA-256. The source descriptor must retain Gradle's
`${file.jarVersion}` expansion placeholder; the built descriptor must contain the
literal release version. `--sha256 <64-lowercase-hex>` asserts an independently
recorded artifact digest. This is integrity/version checking, not a reproducible
build or source-to-bytecode equivalence proof.

`plan` resolves exact names from the official catalog into IDs. Unknown, duplicate
or ambiguous names fail closed. Optional `id` and/or `type_id` selectors in the
manifest disambiguate by ID and `gameVersionTypeID`; a supplied ID still must match
the requested name. This project requests Minecraft 1.21.1, NeoForge, Java 21 and
Server. Those live names/IDs are not hardcoded guesses: a catalog mismatch blocks
publication until reviewed. The source descriptor declares dependencies on both
sides; selecting Server here is release metadata policy for the bundled server
scripts, not a change to the source mod's side declarations.

`--dry-run` performs validation/GET only: it creates no journal, lock or directory
and sends no POST. Plan always has this behavior. Git optional index-refresh locks
are disabled. Status reads only local journal evidence and always reports
`verification-required`, never remote approval/success.

After independently checking the project's remote files for **this exact version**,
a maintainer may explicitly authorize a new upload:

```sh
python3 scripts/curseforge_publish.py upload --tag v1.9.0 \
  --confirm-no-existing-file
```

Use the same journal for local, Hermes and CI operations. `--manifest PATH` is
resolved relative to its own directory for source/artifact paths; `--journal PATH`
and changelog/update paths are relative to the current working directory. The
default changelog is `Release 1.9.0`; `--changelog-file PATH` supplies reviewed text.
No raw response body or exception details are logged; reflected credentials are
sanitized, and no token option exists.

## Metadata-only repair

Create a reviewed JSON file (not a secret), for example:

```json
{"fileID": 1234567, "displayName": "ProductiveMetals ATM10 Compat 1.9.0", "releaseType": "release"}
```

The ID above is an example, **not** a discovered file. Independently verify that
the real target ID belongs to project 1703803 and the intended version before use:

```sh
python3 scripts/curseforge_publish.py update-file --tag v1.9.0 \
  --metadata update.json --confirm-target 1703803:1234567 --dry-run
python3 scripts/curseforge_publish.py update-file --tag v1.9.0 \
  --metadata update.json --confirm-target 1703803:1234567
```

The schema permits `fileID` plus at least one of `changelog`, `changelogType`,
`displayName`, `gameVersions`, `releaseType`, `relations`; it rejects all others,
string IDs, numeric relation types, bare relation arrays and empty changes.
Supplied `gameVersions` must equal the resolved manifest policy. The CLI cannot
prove remote file ownership/version through a documented read endpoint; target
confirmation is an operator assertion, not a verification claim. No binary is
attached/replaced. No DELETE operation is implemented.

## Journal, locking and uncertain outcomes

`.curseforge/journal.json` is private local operational state, ignored by Git.
The CLI locks its sibling `.lock` non-blockingly, writes and fsyncs `pending`
**before POST**, then atomically replaces/fsyncs the journal. A valid result records
`accepted`; repeated identical accepted operations return the existing ID without
another POST. An upload slot is keyed by project/version, not JAR hash, so changing
a JAR/changelog cannot create a second upload for the same version. Metadata edits
are keyed by explicit target and metadata fingerprint. An unresolved edit blocks
other edits to that target as well.

Timeouts, interruptions, HTTP failures, malformed replies, missing IDs and wrong
update IDs are **ambiguous** (or remain pending after abrupt termination). They
never cause automatic upload retries. Even a 4xx is treated conservatively once a
POST is attempted. Journals contain only validated IDs/hashes/policy and state,
not raw responses or credentials.

Do not delete/reset the journal or use a different path to bypass a guard. Retain
copies outside the repo. A maintainer must inspect the author dashboard, project,
version, artifact digest where available, dependencies and moderation state. If a
file exists, recover its exact ID and repair its metadata instead of re-uploading.
If authoritative investigation proves no file exists, archive the old journal and
have the maintainer reconcile that specific pending entry under change review.
There is deliberately no automatic reconcile/force/retry escape hatch. Local
exactly-once protection cannot survive lost journal history or another independent
uploader; remote duplicate checking is mandatory for every newly authorized upload.

## CI operation and required repository settings

The workflow tests the CLI, builds with Java 21 / Gradle 8.14 / the existing
NeoForge version, validates the artifact and retains the JAR. It runs normal
`gradle --no-daemon build`, **not** `-x test`. All third-party actions are full
commit pins from their official repositories; checkout does not persist credentials.
A project-scoped concurrency group does not cancel an in-flight publication.

Before enabling actual publication, configure:

1. A repository ruleset protecting version tags (`v*`), including restricted creation
   and updates. The workflow rejects `github.ref_protected != true` and non-tags.
2. Environment `curseforge-publish` with required reviewers and protected-tag-only
   deployment rules. Creating an environment name in YAML does not configure these
   protections; administrators must do that in repository Settings.
3. `CURSEFORGE_API_KEY` as an environment/repository secret scoped appropriately.
   The former mutable `CF_PROJECT_ID` variable is no longer used.

Tag pushes are **build/preflight/artifact only**, not implicit author writes.
For publication, dispatch the workflow **on the protected release tag**, not main,
and set `publish=true` only after a remote duplicate check. Source/manifest/JAR
versions must still agree with that tag. A manual dispatch on main fails the gate.
The first run (or a run with genuinely missing journal history) also requires
`initialize_journal=true` after independent verification. Never use initialization
as a timeout-retry switch.

CI restores the latest journal cache available to that ref and saves a fresh
run/attempt-keyed cache even after a failed publication. It archives journal
artifacts as recovery evidence as well. GitHub caches are ref-scoped, evictable
and not a transactional database; other tags may not see a previous tag's cache.
Recover/merge reviewed historical journals before initializing a new tag where
needed. If cache/artifact persistence fails or a job is forcibly terminated, stop
and reconcile remotely before another run. Concurrency prevents overlapping jobs
in this workflow, not local or third-party uploaders.

An accepted author ID is **not** evidence that the file is approved/public or that
all metadata took effect. Verify through the dashboard before calling a release
complete. No undocumented consumer endpoint, private destructive route, automatic
release deletion, token query parameter or cross-host redirect is used. Network
requests have a 45-second timeout, no configured proxy, a bounded response body,
an exact host/path allowlist, and redirects disabled.

## Resolved action pins

Resolved using `git ls-remote https://github.com/<official-owner>/<repo>.git`
against the indicated tags during implementation. The Gradle tag is annotated;
its peeled commit, not its tag-object SHA, is pinned.

| Action | Tag | Commit |
|---|---|---|
| actions/checkout | v4 | `11d5960a326750d5838078e36cf38b85af677262` |
| actions/setup-python | v5 | `a26af69be951a213d495a4c3e4e4022e16d87065` |
| actions/setup-java | v4 | `cf277c60eb25467037889841efdb72551f06f6c3` |
| actions/upload-artifact | v4 | `ea165f8d65b6e75b540449e92b4886f43607fa02` |
| actions/cache (restore/save) | v4 | `0057852bfaa89a56745cba8c7296529d2fc39830` |
| gradle/actions/setup-gradle | v4 | `ed408507eac070d1f99cc633dbcf757c94c7933a` |

## Offline verification scope

Unit tests use temporary Git repositories, synthetic ZIPs and fake author network
responses. They exercise validation/no-write behavior, strict schemas, wrong
project/version/hash, numeric resolution, multipart contracts, metadata-only ID
matching, locking, durable pending state, timeout/HTTP-200-without-ID ambiguity,
repeat guards, status limitations, redirects, header/timeouts, missing/conflicting
tokens and secret reflection sanitization. These tests do not claim a live upload,
remote metadata verification, actual Gradle build, or deployed repository policies.
