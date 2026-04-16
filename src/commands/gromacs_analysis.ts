import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('gromacs-analysis')
    .description('Gromacs Analysis')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "gromacs_analysis",
  "summary": "Gromacs Analysis",
  "tags": [
    "tools-predict"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "application/json",
    "schema": {
      "properties": {
        "tpr_file": {
          "type": "string",
          "title": "Tpr File",
          "description": "Local path to .tpr file (from gromacs_md output)"
        },
        "xtc_file": {
          "type": "string",
          "title": "Xtc File",
          "description": "Local path to .xtc file (from gromacs_md output)"
        },
        "edr_file": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Edr File",
          "description": "Optional path to .edr file used for energy term extraction"
        },
        "enable_mdanalysis": {
          "type": "boolean",
          "title": "Enable Mdanalysis",
          "description": "Whether to run fixed MDAnalysis post-analysis reports (default: True)",
          "default": true
        },
        "mdanalysis_residue": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Mdanalysis Residue",
          "description": "Optional residue spec for residue-focused report, e.g. '45' or '12,15-20'"
        },
        "mdanalysis_partner_selection": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ],
          "title": "Mdanalysis Partner Selection",
          "description": "Optional MDAnalysis selection string for residue partner interactions"
        },
        "export_representative_frames": {
          "type": "boolean",
          "title": "Export Representative Frames",
          "description": "Whether to export representative frames (initial/middle/final)",
          "default": true
        },
        "representative_frame_formats": {
          "items": {
            "type": "string"
          },
          "type": "array",
          "title": "Representative Frame Formats",
          "description": "Representative frame formats to export. Supported: pdb, gro"
        },
        "result_policy": {
          "type": "string",
          "title": "Result Policy",
          "description": "Result policy for post-processing warnings: soft or strict",
          "default": "soft"
        },
        "enable_advanced_metrics": {
          "type": "boolean",
          "title": "Enable Advanced Metrics",
          "description": "Whether to run advanced analysis metrics (sasa/hbond/mindist/rdf/energy)",
          "default": true
        },
        "advanced_metrics": {
          "items": {
            "type": "string"
          },
          "type": "array",
          "title": "Advanced Metrics",
          "description": "Subset of advanced metrics to run"
        },
        "xvg_unit_system": {
          "type": "string",
          "title": "Xvg Unit System",
          "description": "Unit system for XVG-derived outputs: native or human",
          "default": "native"
        },
        "max_plot_points": {
          "type": "integer",
          "minimum": 100,
          "title": "Max Plot Points",
          "description": "Maximum points kept when rendering XVG plots/CSVs",
          "default": 5000
        },
        "max_parallel_xvg": {
          "type": "integer",
          "maximum": 16,
          "minimum": 1,
          "title": "Max Parallel Xvg",
          "description": "Maximum parallel XVG post-processing workers",
          "default": 4
        },
        "include_observability_events": {
          "type": "boolean",
          "title": "Include Observability Events",
          "description": "Whether to include pipeline stage events in result payload",
          "default": true
        }
      },
      "type": "object",
      "required": [
        "tpr_file",
        "xtc_file"
      ],
      "title": "GromacsAnalysisInput",
      "description": "Input for GROMACS trajectory analysis"
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
const path = '/api/tools/predict/gromacs-analysis';
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
