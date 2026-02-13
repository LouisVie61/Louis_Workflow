# Chủ đề: Research Hexagonal Architecture using controlled AI workflow

## Tác giả: Triệu Cao Tấn

## Mục lục
- **Hexagonal Architecture**:
    - **Cấu tạo và các quy định của kiến trúc** - **Core Regulations**
    - **Ưu và nhược điểm** - **Benefits and Drawbacks**
    - **Các ca sử dụng của kiến trúc** - **When it's available to apply**
    - **So sánh với các kiến trúc khác**
- **Quá trình sử dụng AI cho chủ đề**

### 1. Hexagonal Architecture

#### Cấu tạo và các quy định của kiến trúc
- Nhìn từ ngoài vào trong, có 3 thành phần chính mà chúng ta có thể thấy rõ:
Interface - Core - Infrastructure 
- Nói đơn giản hơn, kiến trúc này được thiết kế nhằm bảo vệ sự ổn định, các logic quản trị, logic cốt lõi của hệ thống khỏi sự biến động về các hệ thống bên ngoài.
- Về cách lập trình, chúng ta phải tuân thủ quy định **Outside $\rightarrow$ Inside** - tức là, điều này có nghĩa: phần lõi của hệ thống không cần biết về sự tồn tại của các hệ thống bên ngoài, chỉ quy định các logic để các hệ thống bên ngoài làm việc được yêu cầu

```bash
// Ví dụ sai quy luật: 
import OpenAI from 'openai'; // Illegal Dependency injection libs

export class WorkflowService {
  private client = new OpenAI({ apiKey: '...' }); // Illegal initial object 
  // Inside Domain layer

  async run(prompt: string) {
    // Logic "Controlled" was mixed with actual API from outside
    const response = await client.responses.create({
        model: "gpt-5.2",
        input: prompt
    });

    return response.output_text;
  }
}

// Đoạn code vi phạm vì đã nhúng trực tiếp thư viện bên ngoài (Infrastructure) vào lõi nghiệp vụ (Domain), thay vì giao tiếp qua Interface (Port)
```

##### Hình ảnh kiến trúc Hexagonal

![image][1]
Từ hình ảnh trên chúng ta có thể thấy rõ luồng hoạt động chung của kiến trúc được diễn ra như sau:

Tác nhân $\rightarrow$ Nơi tiếp nhận input $\rightarrow$ Lõi (Core) $\rightarrow$ Lớp Domain $\rightarrow$ Cổng (Ports) $\rightarrow$ Thành phần bên ngoài (Adapters)

Như vậy các components chính sẽ có là:
- Nơi tiếp nhận input:
    - Bộ phận cấu thành: Controllers (HTTP, Event, CLI)
    - Nhiệm vụ: tiếp nhận các request từ actor, xử lý chúng và gửi đến core
```bash
// Ví dụ: HTTP Controller
app.post("/users", async (req, res) => {
  const input = new CreateUserDTO(req.body);
  const result = await createUserUseCase.execute(input);
  res.json(result);
});
```
- Lõi:
    - Bộ phận cấu thành: Các công cụ xử lý: Command, Queries, ...
    - Nhiệm vụ: điều phối các requests để domain services, đảm bảo tính độc lập của core, giao tiếp với bên ngoài thông qua Ports
```bash
// Ví dụ
class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(input: CreateUserDTO) {
    const user = User.create(input);
    await this.userRepo.save(user);
    return user;
  }
}
```
- Domain Layer
    - Bộ phận cấu thành: domain services; business rules; entities; value objects
    - Nhiệm vụ: đóng gói các logic, bảo vệ tính độc lập của core khỏi infra
```bash
Ví dụ entity
class User {

  constructor(private email: string) {
    if (!email.includes("@")) {
      throw new Error("Invalid email");
    }
  }

  changeEmail(newEmail: string) {
    if (!newEmail.includes("@")) {
      throw new Error("Invalid email");
    }
    this.email = newEmail;
  }
}
```
- Cổng:
    - Bộ phận cấu thành: các cổng (abstraction)
    - Nhiệm vụ: cầu nối giữa core và adapters
``` bash
Ví dụ: Port cho repository của database
interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
}
```
- Thành phần bên ngoài:
    - Bộ phận bên ngoài: UI, Database, các dịch vụ: AI, Email
    - Nhiệm vụ: implement từ các method từ ports
```bash
// Ví dụ Adapter cho database
class PrismaUserRepository implements UserRepository {
  async save(user: User) {
    await prisma.user.create({ data: user });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }
}
```

#### Ưu điểm và nhược điểm:

##### Ưu điểm:
- Tách được logic: bảo vệ logic quản trị của hệ thống khỏi các thông số, yếu tố đặc biệt của các adapters
- Hệ thống không cần phụ thuộc vào mô hình: có thể sử dụng các mô hình chất lượng hơn theo thời gian mà không ảnh hưởng đến logic lõi
- Cải thiện khả năng test: dễ dàng hơn trong việc debug, phân loại và xác định nhanh chóng hơn lỗi xảy ra ở đâu
- Tăng năng suất: các thành viên trong team hoặc giữa các teams có thể tự do làm việc độc lập

##### Nhược điểm: 
- Tăng độ phức tạp: yêu cầu nhiều hơn các lớp trung gian và code lặp tăng cao từ khi khởi tạo dự án
- Yêu cầu phải hiểu biết: mức độ hiểu biết phải cao, tránh được vi phạm và code nhầm files
- Chất lượng hệ thống: độ phức tạp tăng đồng nghĩa với việc các lớp trung gian được sử dụng tăng -> tăng độ trễ (increase latency)

#### Các ca sử dụng của kiến trúc

- AI có thể hỗ trợ hệ thống ra quyết định (như một hình thức tham khảo) với các điều kiện quản trị sẵn có:
    - Tình huống: AI hỗ trợ, đề xuất, tuy nhiên thì quyết định cuối cùng là hệ thống
    - Ví dụ cụ thể: Các quyết định y tế, Phân tích các tài liệu, ...
    - Lợi ích: Cho phép việc kiểm thử mà không cần gọi model (test business logic)

- Điều phối các AI trong workflow
    - Tình huống:Luồng AI nhiều bước, yêu cầu nhiều vấn đề từ phương án dự phòng (fallback), trình tự cụ thể.
    - Ví dụ: Các nội dung đưa vào -> RAG -> Đánh giá điểm
    - Lợi ích: Luồng làm việc được bảo vệ, các model có thể thay thế 

- Hệ thống sử dụng AI những không phụ thuộc nhà phát triển:
    - Luồng chính giúp quản trị hệ thống cần phải được giữ ổn định trong thời điểm AI thay đổi nhanh chóng.
    - Ví dụ: LLMs, Đánh giá hoặc test hệ thống
    - Lợi ích: dễ dàng sử dụng, áp các các chức năng của AI vào khuôn khổ; Adapters thì giúp ngăn cản hành vi của từng infra ảnh hưởng tới lõi.

#### So sánh với các kiến trúc khác

- Layered Architecture: dễ dàng bị lẫn các logic xử lý AI với luồng quản trị chính của hệ thống; xóa nhòa đi ranh giới các logic lõi và logic điều phối
- Microservices Architecture: Thiếu lập trình đồng bộ; dễ dàng bị tập trung vào phân tách hệ thống bên ngoài mà quên đi logic quản trị, kiểm soát bên trong
- Hexagonal Architecture: Tất cả các logic quản trị hệ thống đề nằm tập trung tại core; nâng cao độ ổn định của hệ thống trong thời đại AI.

### 2. Quá trình sử dụng AI cho chủ đề
#### 2.1 Layered Questioning
- Ngay từ khi bắt đầu, tôi đã thực hiện với việc tìm kiếm các kết quả từ Google để có một cái nhìn tổng quan về hệ thống. Sau đó thì sử dụng AI để thực hiện tìm kiếm các thông tin, yếu tố được nêu ở trong file Overview Tuần 1. Bên cạnh đó thì tôi cũng tự đưa ra thêm các ví dụ và sử dụng các ví dụ từ AI để kiểm soát và trải nghiệm chủ quan với kiến trúc. Để kiểm tra độ hiểu biết và tránh được "ảo giác" của AI, tôi sử dụng thêm hai nguồn nữa là [GeekForGeeks][2] và [StackOverflow][3] để đưa ra các quan điểm đối lập với các luận điểm mà AI trả về cho tôi.
#### 2.2 Solution Exploration
- Quy trình làm việc được triển khai rất nhiều ở phần mà tôi đã nghiên cứu về sự so sánh giữa kiến trúc hình lục giác và các kiến trúc khác. Dựa trên bối cảnh cấu trúc, tôi đã tìm ra những yếu tố khác nhau tạo nên thẩm quyền kiến ​​trúc.
#### 2.3 Iterative Refinement
- Trong phần nội dung quy định thành phần, tôi đã nhận được thông tin về quy tắc phụ thuộc và luồng điều khiển từ AI và nhận ra được một điểm có thể dẫn tới mâu thuẫn và khó hiểu. Theo đó, để trả lời cho thắc mắc này, tôi đã cố gắng diễn giải lại quy trình thành một ví dụ thực tế được bao quanh bởi *nguồn điện - ổ cắm (2 tròn/ 2 dẹt) - phích cắm từ thiết bị bên ngoài*. Từ cả hai phía, tôi đã nhận được câu trả lời cho vấn đề của mình theo quan điểm riêng và tuyên bố này đã được xác nhận bởi cuộc thảo luận tại [StackOverflow][3].

[1]: https://miro.medium.com/v2/resize:fit:1400/0*sKO6vFP7vcTwN-iy.jpg
[2]: https://www.geeksforgeeks.org/system-design/hexagonal-architecture-system-design/
[3]: https://stackoverflow.com/questions/66785439/ddd-hexagon-should-the-domain-layer-ever-talk-to-the-infrastructure-dal-laye 