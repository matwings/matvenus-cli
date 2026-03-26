import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('diffdock-protein-ligand-docking')
    .description('Diffdock Docking')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "diffdock_protein_ligand_docking",
  "summary": "Diffdock Docking",
  "tags": [
    "tools-predict"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "application/json",
    "schema": {
      "properties": {
        "protein_path": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Protein Path",
          "description": "OSS URL to protein PDB file"
        },
        "protein_sequence": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Protein Sequence",
          "description": "Protein sequence (will be folded using ESMFold if protein_path not provided)"
        },
        "ligand": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Ligand",
          "description": "Ligand SMILES string or OSS URL to ligand file (.sdf, .mol2, etc.)"
        },
        "protein_ligand_csv": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Protein Ligand Csv",
          "description": "OSS URL to CSV file containing multiple protein-ligand pairs with columns: complex_name, protein_path, ligand_description, protein_sequence"
        },
        "num_poses": {
          "type": "integer",
          "title": "Num Poses",
          "description": "Number of poses to generate per complex (default: 10)",
          "default": 10
        }
      },
      "type": "object",
      "title": "DiffDockInput",
      "description": "Input for DiffDock protein-ligand docking prediction"
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
const path = '/api/tools/predict/diffdock';
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
