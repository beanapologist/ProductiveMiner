import torch
from transformers import XLNetModel

# Load the model
model = XLNetModel.from_pretrained("xlnet-base-cased")
model.eval()

# Create example input
example_input = torch.randint(0, 32000, (1, 10))

# Export to ONNX
torch.onnx.export(
    model,                     # model being run
    example_input,             # model input (or a tuple for multiple inputs)
    "xlnet_model.onnx",       # where to save the model
    export_params=True,        # store the trained parameter weights inside the model file
    opset_version=11,          # the ONNX version to export the model to
    do_constant_folding=True,  # whether to execute constant folding for optimization
    input_names=['input_ids'], # the model's input names
    output_names=['output'],   # the model's output names
    dynamic_axes={             # variable length axes
        'input_ids': {0: 'batch_size'},
        'output': {0: 'batch_size'}
    }
)

print("✅ Model exported to ONNX successfully!")
print(f"📦 ONNX model saved as: xlnet_model.onnx")
print(f"🔍 Input shape: {example_input.shape}")

# Test the original model
with torch.no_grad():
    output = model(example_input)
    print(f"🎯 Output shape: {output.last_hidden_state.shape}") 