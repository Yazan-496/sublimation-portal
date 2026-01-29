import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const OWNER = process.env.TARGET_REPO_OWNER!;
const REPO = process.env.TARGET_REPO_NAME!;
const BRANCH = process.env.TARGET_REPO_BRANCH || "main";

export async function getFileContent(path: string) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH,
    });

    if (Array.isArray(response.data)) {
      throw new Error("Path is a directory, not a file");
    }

    if (!('content' in response.data)) {
      throw new Error("No content found");
    }

    const content = Buffer.from(response.data.content, "base64").toString("utf-8");
    return {
      content,
      sha: response.data.sha,
      path: response.data.path,
    };
  } catch (error) {
    console.error(`Error fetching file ${path}:`, error);
    throw error;
  }
}

export async function getDirectoryContents(path: string) {
  try {
    const response = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: path,
      ref: BRANCH,
    });

    if (!Array.isArray(response.data)) {
      throw new Error("Path is not a directory");
    }

    return response.data.map((item) => ({
      name: item.name,
      path: item.path,
      type: item.type, // 'file' or 'dir'
      sha: item.sha,
      download_url: item.download_url,
    }));
  } catch (error) {
    console.error(`Error fetching directory ${path}:`, error);
    throw error;
  }
}

export async function updateFile(path: string, content: string, sha: string, message: string) {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: message,
      content: Buffer.from(content).toString("base64"),
      sha: sha,
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error(`Error updating file ${path}:`, error);
    throw error;
  }
}

export async function uploadImage(path: string, buffer: Buffer, sha: string | undefined, message: string) {
  try {
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: message,
      content: buffer.toString("base64"),
      sha: sha, // Provide SHA if replacing, undefined if new
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error(`Error uploading image ${path}:`, error);
    throw error;
  }
}

export async function deleteFile(path: string, sha: string, message: string) {
  try {
    await octokit.rest.repos.deleteFile({
      owner: OWNER,
      repo: REPO,
      path: path,
      message: message,
      sha: sha,
      branch: BRANCH,
    });
    return true;
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
    throw error;
  }
}
