'use server';

import { updateFile, uploadImage, deleteFile } from "@/lib/github";
import { revalidatePath } from "next/cache";

export async function saveJsonFile(path: string, content: string, sha: string) {
  try {
    // Validate JSON
    JSON.parse(content);
    
    await updateFile(path, content, sha, `Update ${path} via Dashboard`);
    revalidatePath('/dashboard/data');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;
    const sha = formData.get('sha') as string || undefined; // If replacing
    
    if (!file || !path) {
      throw new Error("Missing file or path");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await uploadImage(path, buffer, sha, `Upload image ${path} via Dashboard`);
    revalidatePath('/dashboard/images');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteFileAction(path: string, sha: string) {
  try {
    await deleteFile(path, sha, `Delete ${path} via Dashboard`);
    revalidatePath('/dashboard/images');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
