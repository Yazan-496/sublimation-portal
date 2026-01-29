
## GitHub Integration Setup

To connect the dashboard with your GitHub repository for data storage and image management, you need to configure the following environment variables.

1.  Rename or create a `.env.local` file in the root directory.
2.  Add the following variables:

```env
GITHUB_TOKEN=your_github_personal_access_token
TARGET_REPO_OWNER=your_github_username
TARGET_REPO_NAME=your_repository_name
TARGET_REPO_BRANCH=main
```

### How to get a GitHub Token:
1.  Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic).
2.  Generate a new token.
3.  Select the `repo` scope (Full control of private repositories).
4.  Copy the token and paste it into `GITHUB_TOKEN`.
