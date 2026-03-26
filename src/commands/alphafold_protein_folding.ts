import { Command } from 'commander';
import { request, buildPath, buildQuery } from '../client';


export function register(program: Command, baseUrl: string): void {
  program
    .command('alphafold-protein-folding')
    .description('Alphafold Folding')
  .option('--body <json>', 'Request body as JSON string', (value) => value)
  .option('--base-url <url>', 'Override base URL')
  .option('--output <format>', 'Output format: json, table', 'json')
  .option('--schema', 'Show API schema and exit')
    .action(async (options) => {
      if (options.schema) {
        console.log(JSON.stringify({
  "method": "post",
  "operationId": "alphafold_protein_folding",
  "summary": "Alphafold Folding",
  "tags": [
    "tools-predict"
  ],
  "parameters": [],
  "requestBody": {
    "required": true,
    "contentType": "application/json",
    "schema": {
      "properties": {
        "model_version": {
          "type": "string",
          "title": "Model Version",
          "description": "AlphaFold version to use: 'alphafold2' or 'alphafold3'",
          "default": "alphafold2"
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
          "description": "Protein sequence in single letter amino acid code (for simple single-chain prediction)"
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
          "description": "OSS URL to FASTA file (.fasta, .fa, or .faa) (for simple single/multi-chain prediction)"
        },
        "sequences": {
          "anyOf": [
            {
              "items": {
                "additionalProperties": true,
                "type": "object"
              },
              "type": "array"
            },
            {
              "type": "null"
            }
          ],
          "title": "Sequences",
          "description": "List of sequence entities for multi-chain prediction. For AlphaFold2: Only protein chains are supported (DNA/RNA/ligands ignored). For AlphaFold3: Full support for proteins, DNA, RNA, and ligands. Each entity can be: {'protein': {'id': 'A', 'sequence': 'PVLSCGEWQL', 'description': 'Chain A', 'modifications': [{'ptmType': 'HY3', 'ptmPosition': 1}], 'unpairedMsa': '...', 'pairedMsa': '...', 'templates': [...]}} {'dna': {'id': 'C', 'sequence': 'GACCTCT', 'modifications': [{'modificationType': '6OG', 'basePosition': 1}], 'unpairedMsa': '...'}} (AF3 only) {'rna': {'id': 'E', 'sequence': 'AGCU', 'modifications': [{'modificationType': '2MG', 'basePosition': 1}], 'unpairedMsa': '...'}} (AF3 only) {'ligand': {'id': ['F', 'G'], 'ccdCodes': ['ATP']}} or {'ligand': {'id': 'Z', 'smiles': 'CC(=O)OC1C[NH+]2CCC1CC2'}} (AF3 only)"
        },
        "model_seeds": {
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
          "title": "Model Seeds",
          "description": "Random seeds for AlphaFold3 prediction (default: [42])",
          "default": [
            42
          ]
        }
      },
      "type": "object",
      "title": "AlphaFoldInput",
      "description": "Input for AlphaFold2/3 protein structure prediction"
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
const path = '/api/tools/predict/alphafold';
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
