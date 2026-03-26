import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('rfdiffusion-protein-design')
    .description('Rfdiffusion Design')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "rfdiffusion_protein_design",
  "summary": "Rfdiffusion Design",
  "tags": [
    "tools-predict"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "application/json",
    "schema": {
      "properties": {
        "input_pdb": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Input Pdb",
          "description": "OSS URL to input PDB file (optional for unconditional generation)"
        },
        "contig": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Contig",
          "description": "Contig specification string (e.g., 'A10-20,80' for motif scaffolding)"
        },
        "num_designs": {
          "type": "integer",
          "title": "Num Designs",
          "description": "Number of designs to generate (default: 1)",
          "default": 1
        },
        "length": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Length",
          "description": "Total design length constraint (e.g., '100' or '80-120')"
        },
        "hotspots": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Hotspots",
          "description": "Hotspot residues specification for binder design (e.g., 'A10,A15,A20')"
        },
        "partial_t": {
          "anyOf": [
            {
              "type": "number"
            },
            {
              "type": "null"
            }
          ],
          "title": "Partial T",
          "description": "Noise level for partial diffusion in Angstroms (e.g., 5.0-15.0)"
        },
        "T": {
          "type": "integer",
          "title": "T",
          "description": "Number of diffusion steps (default: 50)",
          "default": 50
        },
        "seed_offset": {
          "type": "integer",
          "title": "Seed Offset",
          "description": "Random seed offset (default: 0)",
          "default": 0
        },
        "recenter": {
          "type": "boolean",
          "title": "Recenter",
          "description": "Recenter structure (default: True)",
          "default": true
        },
        "radius": {
          "type": "number",
          "title": "Radius",
          "description": "Radius for neighbor calculation (default: 10.0)",
          "default": 10
        },
        "num_recycles": {
          "type": "integer",
          "title": "Num Recycles",
          "description": "Number of recycles (default: 1)",
          "default": 1
        },
        "softmax_T": {
          "type": "number",
          "title": "Softmax T",
          "description": "Softmax temperature (default: 1e-5)",
          "default": 0.00001
        },
        "write_trb": {
          "type": "boolean",
          "title": "Write Trb",
          "description": "Write .trb files (default: True)",
          "default": true
        },
        "cautious": {
          "type": "boolean",
          "title": "Cautious",
          "description": "Use cautious mode (default: True)",
          "default": true
        },
        "align_motif": {
          "type": "boolean",
          "title": "Align Motif",
          "description": "Align motif (default: True)",
          "default": true
        },
        "final_step": {
          "type": "integer",
          "title": "Final Step",
          "description": "Final diffusion step (default: 1)",
          "default": 1
        },
        "guide_scale": {
          "type": "number",
          "title": "Guide Scale",
          "description": "Guidance scale (default: 10.0)",
          "default": 10
        }
      },
      "type": "object",
      "required": [
        "input_pdb"
      ],
      "title": "RFdiffusionInput",
      "description": "Input for RFdiffusion protein design"
    },
    "isBinary": false
  },
  "responses": [
    {
      "statusCode": "200",
      "description": "Successful Response",
      "contentType": "application/json",
      "schema": {
        "properties": {
          "tool_call_id": {
            "type": "string",
            "title": "Tool Call Id",
            "description": "系统生成的调用唯一ID"
          },
          "status": {
            "description": "调用状态: running, success, error 等",
            "type": "string",
            "enum": [
              "pending",
              "running",
              "success",
              "error"
            ],
            "title": "ToolResultStatus"
          },
          "result": {
            "anyOf": [
              {},
              {
                "type": "null"
              }
            ],
            "title": "Result",
            "description": "如果即时成功，这里是工具的返回结果字典"
          },
          "error_message": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Error Message",
            "description": "如果有错误，提供错误信息"
          },
          "credits_cost": {
            "anyOf": [
              {
                "type": "number"
              },
              {
                "type": "null"
              }
            ],
            "title": "Credits Cost",
            "description": "消费积分"
          },
          "tool_name": {
            "type": "string",
            "title": "Tool Name",
            "description": "执行的工具名"
          }
        },
        "type": "object",
        "required": [
          "tool_call_id",
          "status",
          "tool_name"
        ],
        "title": "ToolInvokeResponse"
      },
      "isBinary": false
    },
    {
      "statusCode": "422",
      "description": "Validation Error",
      "contentType": "application/json",
      "schema": {
        "properties": {
          "detail": {
            "items": {
              "properties": {
                "loc": {
                  "items": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "integer"
                      }
                    ]
                  },
                  "type": "array",
                  "title": "Location"
                },
                "msg": {
                  "type": "string",
                  "title": "Message"
                },
                "type": {
                  "type": "string",
                  "title": "Error Type"
                }
              },
              "type": "object",
              "required": [
                "loc",
                "msg",
                "type"
              ],
              "title": "ValidationError"
            },
            "type": "array",
            "title": "Detail"
          }
        },
        "type": "object",
        "title": "HTTPValidationError"
      },
      "isBinary": false
    }
  ],
  "security": [
    "HTTPBearer"
  ]
}, null, 2));
        return;
      }

      

      try {
        const currentBaseUrl = options.baseUrl || baseUrl;
        const config = { baseUrl: currentBaseUrl };
const path = '/api/tools/predict/rfdiffusion-design';
const url = path;


      const body = options.body ? JSON.parse(options.body) : undefined;
      
      const response = await request(config, {
        method: 'post',
        path: url,
        headers: undefined,
        body: body,
        isBinary: false,
      });

      

      const data = response;
      if (options.output === 'json') {
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log(data);
      }
    } catch (error: any) {
      if (error.status) {
        console.error('API Error:', error.status, error.message);
        if (error.data) {
          console.error(JSON.stringify(error.data, null, 2));
        }
      } else {
        console.error('Error:', error.message);
      }
      process.exit(1);
    }
  });
}
