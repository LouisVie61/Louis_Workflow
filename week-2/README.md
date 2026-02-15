Để bắt đầu tuần 2:
13/02/2026
- Tôi thực hiện tìm hiểu CLI tool là gì? Thành phần của nó? Nó khác như thế nào so với regular WebApp? 
    - CLI = Command Line Interface: phần mềm tương tác bằng dòng văn bản (text) vào cửa sổ terminal/ console/ khong dung GUI
    - Thanh phan: 
        - Command (Primary - name entity/ Sub - replace GET/POST/... -> Giúp phân tích logic ngay từ đầu)
        - Options (Long/ Short) - like Flag - dùng để lọc hoặc bổ sung các thông tin không cần thiết
        - Argument (Option - reference value pass into option/ Command - main content - dữ liệu chính) - chỉ định đến đối tượng cụ thể muốn áp dụng
        - Them vi du:
        ticket update 1 --status "done" 
```bash
// src/adapters/cli/TicketCommander.js
const { program } = require('commander');

// 1. Định nghĩa cấu trúc lệnh
program
  .command('update <id>') // <id> là Command Argument (bắt buộc)
  .option('-s, --status <type>', 'Trạng thái mới') // --status là Option
  .action((id, options) => {
    
    // 2. Chuyển đổi thành Object sạch (DTO)
    // Adapter xử lý việc ép kiểu (ví dụ: id từ string sang number)
    const updateRequest = {
      ticketId: Number(id),
      newStatus: options.status
    };

    // 3. Gọi Service (Core)
    // Core không biết 'options.status' là cái gì, nó chỉ nhận 'newStatus'
    ticketService.updateStatus(updateRequest);
    
    console.log("Cập nhật thành công!");
  });
```
- So sánh Regular Webapp (rwa) và CLI tool
    - data flow:
        - rwa: trigger: một network event; protocol: HTTP; Input: header, query params, body, cookies; Output: HTTP Status
        - cli tool: trigger: một execution event; protocol: không có, luồng dữ liệu chuẩn: std (in, out, err); Input: arguments, options, env; Output: plain text, tables, ...
    - Config va khởi tạo:
        - rwa: long-running process (tiến trình chạy liên tục); config: port, cors, ...; lifecycle: chạy một lần và đợi request
        - cli tool: short-lived process (tiến trình chạy rồi nghỉ): config: đường dẫn, phân tích tham số, dòng lệnh (bash programming maybe); lifecycle: Khởi tạo -> kết nối source -> Xử lý yêu cầu -> Ngắt kết nối -> Thoát
        
- Note: trong Hexagonal: CLI Adapters chuyển Command Arguments -> Object: trong ví dụ *ticket update 1 --status "done"* -> muốn đổi '--status' thành '--state' -> chỉ cần sửa tại Adapter -> Core giữ nguyên (business rule: theo nguyên tắc -> không thay đổi)


Một hệ thống áp dụng kiến trúc Hexagonal - như vậy tổng kết lại:
src
- application:
  - ports: inbound ports (in -> out(use case))/ outbound ports(out -> in: database)
- domain:
  - entity:
  - value-objects:
  - service:
- infrastructure:
  - adapter: persistence + ui
  - dependency injection
  