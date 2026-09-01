import re

file_path = 'resources/js/lib/toast.ts'
with open(file_path, 'r') as f:
    content = f.read()

# Replace the try block in handleAsyncAction
old_try_block = """    try {
        const result = await apiCall();
        const finalSuccessMsg = typeof successMessage === 'function' ? successMessage(result) : successMessage;
        toast.success(finalSuccessMsg, { id: toastId });
        return result;
    }"""

new_try_block = """    try {
        const result = await apiCall();
        // Hapus loading toast saat sukses, dan biarkan FlashMessageToaster menangkap pesan sukses dari backend
        toast.dismiss(toastId); 
        return result;
    }"""

content = content.replace(old_try_block, new_try_block)

with open(file_path, 'w') as f:
    f.write(content)

print("Updated handleAsyncAction in toast.ts")
