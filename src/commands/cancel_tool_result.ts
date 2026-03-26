import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('cancel-tool-result')
    .description('Cancel Tool Result')
  .requiredOption('--tool-call-id <value>', 'tool_call_id')
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "cancel_tool_result",
  "summary": "Cancel Tool Result",
  "description": "取消处于 pending 或 running 状态的工具任务。\n如果工具包含 Slurm 任务，会先取消 Slurm 任务再更新状态。\n通过 API Key 鉴权。",
  "tags": [
    "tools-results"
  ],
  "parameters": [
    {
      "name": "tool_call_id",
      "in": "path",
      "required": true,
      "schema": {
        "type": "string",
        "title": "Tool Call Id"
      },
      "type": "string"
    }
  ],
  "responses": [
    {
      "statusCode": "200",
      "description": "Successful Response",
      "contentType": "application/json",
      "schema": {
        "properties": {
          "id": {
            "type": "string",
            "title": "Id",
            "description": "工具结果ID"
          },
          "session_id": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Session Id",
            "description": "会话ID"
          },
          "tool_call_id": {
            "type": "string",
            "title": "Tool Call Id",
            "description": "工具调用ID"
          },
          "tool_result": {
            "anyOf": [
              {},
              {
                "type": "null"
              }
            ],
            "title": "Tool Result",
            "description": "工具执行结果"
          },
          "tool_name": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tool Name",
            "description": "工具名称"
          },
          "tool_name_desc": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tool Name Desc",
            "description": "显示工具名称"
          },
          "tool_type": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tool Type",
            "description": "工具类型"
          },
          "tool_args": {
            "anyOf": [
              {
                "additionalProperties": true,
                "type": "object"
              },
              {
                "type": "null"
              }
            ],
            "title": "Tool Args",
            "description": "工具参数"
          },
          "status": {
            "description": "执行状态：pending(排队中), running(运行中), success(成功), error(错误)",
            "type": "string",
            "enum": [
              "pending",
              "running",
              "success",
              "error"
            ],
            "title": "ToolResultStatus"
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
            "description": "错误信息"
          },
          "started_at": {
            "type": "string",
            "format": "date-time",
            "title": "Started At",
            "description": "开始时间"
          },
          "completed_at": {
            "anyOf": [
              {
                "type": "string",
                "format": "date-time"
              },
              {
                "type": "null"
              }
            ],
            "title": "Completed At",
            "description": "完成时间"
          },
          "slurm_tasks": {
            "items": {
              "properties": {
                "id": {
                  "type": "string",
                  "title": "Id",
                  "description": "任务ID"
                },
                "slurm_job_id": {
                  "type": "string",
                  "title": "Slurm Job Id",
                  "description": "Slurm作业ID"
                },
                "status": {
                  "type": "string",
                  "title": "Status",
                  "description": "任务状态"
                },
                "task_type": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Task Type",
                  "description": "任务类型"
                },
                "resource_type": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Resource Type",
                  "description": "资源类型: GPU/CPU"
                },
                "run_time": {
                  "anyOf": [
                    {
                      "type": "integer"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Run Time",
                  "description": "运行时长（秒）"
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
                  "description": "该任务积分消耗"
                },
                "started_at": {
                  "anyOf": [
                    {
                      "type": "string",
                      "format": "date-time"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Started At",
                  "description": "开始时间"
                },
                "completed_at": {
                  "anyOf": [
                    {
                      "type": "string",
                      "format": "date-time"
                    },
                    {
                      "type": "null"
                    }
                  ],
                  "title": "Completed At",
                  "description": "完成时间"
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
                  "description": "错误信息"
                }
              },
              "type": "object",
              "required": [
                "id",
                "slurm_job_id",
                "status"
              ],
              "title": "SlurmTaskInfo",
              "description": "Slurm任务信息（嵌入ToolResult响应）"
            },
            "type": "array",
            "title": "Slurm Tasks",
            "description": "关联的Slurm任务列表"
          }
        },
        "type": "object",
        "required": [
          "id",
          "tool_call_id",
          "status",
          "started_at"
        ],
        "title": "ToolResultResponse",
        "description": "工具结果响应模型"
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
const pathParams = {
        ['tool_call_id']: options.toolCallId,
      };
      const path = buildPath('/api/tools/results/{tool_call_id}/cancel', pathParams);
const url = path;


      
      const response = await request(config, {
        method: 'post',
        path: url,
        headers: undefined,
        body: undefined,
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
