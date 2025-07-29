import torch
from transformers import XLNetModel

# Load the model
model = XLNetModel.from_pretrained("xlnet-base-cased")
model.eval()

# Script the model (more flexible than tracing)
scripted_model = torch.jit.script(model)

# Save the scripted model
scripted_model.save("xlnet_scripted.pt")

print("✅ Model scripted and saved successfully!")
print(f"📦 Scripted model saved as: xlnet_scripted.pt")

# Test with example input
example_input = torch.randint(0, 32000, (1, 10))
with torch.no_grad():
    output = scripted_model(example_input)
    print(f"🎯 Output shape: {output.last_hidden_state.shape}") 