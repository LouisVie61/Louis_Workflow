import * as https from 'https';
import * as http from 'http';
import { IHTTPAdapter } from '../../application/port/OutboundPort/IHTTPAdapter';

export class HTTPAdapter implements IHTTPAdapter {
  async post(url: string, data: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const body = JSON.stringify(data);
      const urlObj = new URL(url);
      const lib = urlObj.protocol === 'https:' ? https : http;
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      };
      const req = lib.request(options, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => {
          const contentType = res.headers['content-type'];
          if (!contentType?.includes('application/json')) {
            console.error('Non-JSON response:', raw);
            return reject(new Error('Expected JSON but got non-JSON response'));
          }
            
          try { resolve(JSON.parse(raw)); }
          catch (e) { reject(e); }
        });
      });
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }
}