import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('venusprime-multipoint-prediction')
    .description('Venusprime Multipoint')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "venusprime_multipoint_prediction",
  "summary": "Venusprime Multipoint",
  "tags": [
    "tools-predict"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "application/json",
    "schema": {
      "properties": {
        "mode": {
          "type": "string",
          "title": "Mode",
          "description": "Operation mode: 'train' to train models from experimental data, 'inference' to predict multi-point mutations using trained models",
          "default": "inference"
        },
        "venus_mode": {
          "type": "string",
          "title": "Venus Mode",
          "description": "Model mode: 'light' for ridge regression (default), 'pro' for sesnet (not implemented yet)",
          "default": "light"
        },
        "sequence": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Sequence",
          "description": "Wild-type protein sequence (required for train mode if fasta_file not provided)"
        },
        "fasta_file": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Fasta File",
          "description": "OSS URL to FASTA file with wild-type sequence (required for train mode if sequence not provided)"
        },
        "experiment_file": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Experiment File",
          "description": "OSS URL to CSV file with 'mutant' and 'score' columns for training (required for train mode)"
        },
        "score_col_name": {
          "type": "string",
          "title": "Score Col Name",
          "description": "Name of score column in experiment_file to train"
        },
        "model_path_list": {
          "anyOf": [
            {
              "items": {
                "type": "string"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "title": "Model Path List",
          "description": "List of trained model file paths or OSS URLs (required for inference mode)"
        },
        "site": {
          "anyOf": [
            {
              "items": {
                "type": "integer"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "title": "Site",
          "description": "Mutation site numbers for combination mutations in inference mode (default: [2, 3, 4])",
          "default": [
            2,
            3,
            4
          ]
        },
        "model_num": {
          "type": "integer",
          "title": "Model Num",
          "description": "Number of ensemble models to train (for train mode, default: 5)",
          "default": 5
        },
        "batch_size": {
          "type": "integer",
          "title": "Batch Size",
          "description": "Batch size for embedding extraction during training (for train mode, default: 4)",
          "default": 4
        },
        "inference_batch_size": {
          "type": "integer",
          "title": "Inference Batch Size",
          "description": "Batch size for embedding extraction during inference (for inference mode, default: 32)",
          "default": 32
        },
        "config": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Config",
          "description": "Path to VenusPrime config YAML file (optional, default: venusprime_config.yaml in script directory)"
        },
        "target_server": {
          "type": "string",
          "title": "Target Server",
          "description": "Target server for job submission: 'slurm' or 'paracloud'",
          "default": "slurm"
        }
      },
      "type": "object",
      "title": "VenusPrimeInput",
      "description": "Input for VenusPrime multi-point combination mutation prediction (light=ridge regression, pro=reserved)"
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
const path = '/api/tools/predict/venusprime-multipoint';
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
