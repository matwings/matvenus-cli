import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('upload-file-multipart')
    .description('Upload File Multipart')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--file <path>', 'File to upload')
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "upload_file_multipart",
  "summary": "Upload File Multipart",
  "description": "通过 multipart/form-data 上传文件到存储系统，返回 OSS URL和文件路径等数据。",
  "tags": [
    "tools-upload",
    "tools-upload-http"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "multipart/form-data",
    "schema": {
      "properties": {
        "file": {
          "type": "string",
          "format": "binary",
          "title": "File",
          "description": "文件（FASTA、PDB、CSV、SDF 等）"
        }
      },
      "type": "object",
      "required": [
        "file"
      ],
      "title": "Body_upload_file_multipart"
    },
    "isBinary": true
  },
  "responses": [
    {
      "statusCode": "201",
      "description": "Successful Response",
      "contentType": "application/json",
      "schema": {
        "properties": {
          "file_id": {
            "type": "string",
            "title": "File Id",
            "description": "文件id"
          },
          "success": {
            "type": "boolean",
            "title": "Success",
            "description": "文件是否上传成功",
            "default": true
          },
          "filename": {
            "type": "string",
            "title": "Filename",
            "description": "文件原始名称"
          },
          "local_path": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Local Path",
            "description": "文件在用户workspace的本地路径"
          },
          "url": {
            "anyOf": [
              {
                "type": "string"
              },
              {
                "type": "null"
              }
            ],
            "title": "Url",
            "description": "文件oss url"
          },
          "size": {
            "anyOf": [
              {
                "type": "integer"
              },
              {
                "type": "null"
              }
            ],
            "title": "Size",
            "description": "文件大小"
          }
        },
        "type": "object",
        "required": [
          "file_id",
          "filename"
        ],
        "title": "UploadFileResponse"
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
const path = '/api/tools/upload/multipart';
const url = path;


      const body = new FormData();
      if (options.body) {
        const bodyObj = JSON.parse(options.body);
        for (const [key, value] of Object.entries(bodyObj)) {
          body.append(key, value as any);
        }
      }
      if (options.file) {
        const fs = await import('fs');
        const { blob } = await import('node:stream/consumers');
        const fileStream = fs.createReadStream(options.file);
        // In Node 18+ fetch supports Blob/File in FormData
        body.append('file', await blob(fileStream) as any, options.file);
      }
      
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
