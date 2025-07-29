import torch
from transformers import XLNetModel

# Load the model
model = XLNetModel.from_pretrained("xlnet-base-cased")
model.eval()  # Set to evaluation mode

# Create example input
example_input = torch.randint(0, 32000, (1, 10))

# Trace the model using PyTorch's built-in tracing
traced_model = torch.jit.trace(model, example_input)

# Save the traced model
traced_model.save("xlnet_traced.pt")

print("✅ Model traced and saved successfully!")
print(f"📦 Traced model saved as: xlnet_traced.pt")
print(f"🔍 Input shape: {example_input.shape}")
print(f"📊 Model type: {type(traced_model)}")

# Test the traced model
with torch.no_grad():
    output = traced_model(example_input)
    print(f"🎯 Output shape: {output.last_hidden_state.shape}") 