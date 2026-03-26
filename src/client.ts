export interface ApiClientConfig {
  baseUrl: string;
}

export interface RequestOptions {
  method: string;
  path: string;
  headers?: Record<string, string>;
  body?: any;
  isBinary?: boolean;
}

export async function request(config: ApiClientConfig, options: RequestOptions): Promise<any> {
  const url = new URL(options.path, config.baseUrl.endsWith('/') ? config.baseUrl : config.baseUrl + '/');
  
  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.method.toUpperCase() !== 'GET') {
    headers['Content-Type'] = 'application/json';
  }

  // Add authentication from environment variables
  
  // HTTPBearer: Bearer token
  const HTTPBearerToken = process.env.API_BEARER_TOKEN;
  if (HTTPBearerToken) {
    headers['Authorization'] = `Bearer ${HTTPBearerToken}`;
  }

  const response = await fetch(url.toString(), {
    method: options.method.toUpperCase(),
    headers,
    body: (options.body instanceof FormData || options.body?.pipe) 
      ? options.body 
      : (options.body ? JSON.stringify(options.body) : undefined),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(`API Error: ${response.status} ${response.statusText}`);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  if (options.isBinary) {
    return response.body;
  }

  return response.json();
}

// Helper to handle path parameters
export function buildPath(template: string, params: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    if (params[key] === undefined) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    return encodeURIComponent(String(params[key]));
  });
}

// Helper to build query string
export function buildQuery(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.set(key, String(value));
      }
    }
  }
  return searchParams.toString();
}
