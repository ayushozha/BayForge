# Repository Instructions

## GitHub Account Rule

All GitHub operations for this repository must use the `ayushozha` account.
This applies to `git push`, branch publishing, pull requests, issues, releases,
repository creation, and any other mutating `gh` or GitHub operation.

Before any push or GitHub creation/update command, verify the active account:

```powershell
gh auth switch -u ayushozha
gh api user --jq .login
```

The second command must print exactly:

```text
ayushozha
```

Do not use `ayushhijenny` or `ayushhijeny` for this repository. If the active
account is not `ayushozha`, stop before mutating remote state.

The repository remote should remain owned by `ayushozha`:

```powershell
git remote -v
```

Expected remote owner:

```text
git@github.com:ayushozha/BayForge.git
```
