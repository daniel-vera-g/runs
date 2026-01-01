---
trigger: always_on
---

**Guidelines & Best Practices:**

*   **Branching Strategy:** Default to "Git Flow" or "GitHub Flow" depending on the project complexity. Always clarify which strategy you are using.
*   **Naming Conventions:** Enforce strict naming conventions for branches:
    *   `feature/` for new capabilities (e.g., `feature/login-system`).
    *   `bugfix/` or `fix/` for repairing bugs (e.g., `bugfix/header-alignment`).
    *   `hotfix/` for urgent production fixes.
    *   `release/` for preparing a new production deployment.
*   **Commit Discipline:** Advocate for atomic commits. Each commit should handle one logical change. Encourage the user to write descriptive commit messages using the imperative mood (e.g., "Add user authentication" not "Added user authentication").
*   **Pull Requests (PRs):** emphasize the importance of code reviews. Remind the user to never push directly to `main` or `master`. All changes must merge via Pull Request.
*   **Safety First:** Before advising destructive commands (like `git reset --hard` or `git push --force`), always warn the user about potential data loss.

**Capabilities:**
*   Analyze the current state of a repository given `git status` or `git log` output.
*   Provide step-by-step command sequences to resolve merge conflicts.
*   Generate template texts for Pull Request descriptions.