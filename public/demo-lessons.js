import {exercises} from './data.js';
const topics=[
  [6,'sign','Cộng, trừ số nguyên',[1,3,6],'So sánh dấu, cộng trừ số nguyên và dùng số đối.','Khi trừ một số âm, đổi thành cộng số đối; khi cộng khác dấu, so sánh giá trị tuyệt đối trước.'],
  [6,'sign','Nhân, chia và lũy thừa số nguyên',[2,4,5],'Xác định dấu của tích, thương và lũy thừa.','Hai thừa số âm cho tích dương. Lũy thừa bậc lẻ của số âm vẫn âm; phải đọc dấu ngoặc trước khi tính.'],
  [6,'fractions6','Phép tính với phân số',[1,2,3],'Quy đồng, cộng trừ, nhân và rút gọn phân số.','Cộng hoặc trừ cần cùng mẫu; nhân phân số thì nhân tử với tử, mẫu với mẫu. Mẫu số phải khác 0.'],
  [6,'percent6','Tỉ số phần trăm trong đời sống',[1,2,3],'Tính phần trăm của một đại lượng và giá sau giảm.','p% của A bằng A nhân p rồi chia 100. Giá sau giảm bằng giá gốc trừ số tiền giảm, không trừ trực tiếp số p.'],
  [6,'area6','Diện tích hình phẳng',[1,2,3],'Phân biệt chu vi, diện tích và chọn đúng chiều cao.','Diện tích hình chữ nhật bằng tích hai cạnh; diện tích tam giác bằng nửa tích đáy và chiều cao tương ứng. Dùng cùng đơn vị đo.'],
  [7,'sign','Ôn nền: quy tắc dấu',[1,2,3],'Củng cố quy tắc dấu trước khi tính với số hữu tỉ.','Xác định phép toán trước, sau đó mới áp dụng quy tắc dấu. Quy tắc của phép cộng không giống phép nhân.'],
  [7,'distribute','Phân phối và bỏ ngoặc',[1,2,3],'Nhân với từng số hạng và bỏ ngoặc có dấu trừ.','Thừa số bên ngoài phải nhân với tất cả số hạng bên trong. Dấu trừ trước ngoặc đổi dấu mọi số hạng.'],
  [7,'combine','Đơn thức đồng dạng',[1,2,3],'Nhận diện phần biến và thu gọn biểu thức.','Chỉ gộp các số hạng có cùng phần biến. Cộng hệ số, giữ nguyên phần biến; không cộng số mũ khi cộng đơn thức.'],
  [7,'ratio7','Đại lượng tỉ lệ thuận',[1,2,3],'Tìm hệ số tỉ lệ và vận dụng đơn giá.','Nếu y tỉ lệ thuận với x thì y = kx. Tìm k bằng y chia x với x khác 0, rồi giữ nguyên k cho các cặp giá trị tiếp theo.'],
  [7,'angles7','Góc trong tam giác',[1,2,3],'Tính góc còn lại, góc nhọn tam giác vuông và góc đáy tam giác cân.','Tổng ba góc trong bằng 180°. Tam giác vuông có hai góc nhọn phụ nhau; tam giác cân có hai góc ở đáy bằng nhau.'],
  [8,'distribute','Ôn nền: biến đổi biểu thức',[4,5,6],'Kiểm soát dấu khi phân phối và bỏ ngoặc.','Viết từng tích riêng để tránh mất số hạng hoặc sai dấu. Sau khi khai triển, thế một giá trị để kiểm tra.'],
  [8,'combine','Thu gọn sau khi khai triển',[4,5,6],'Phối hợp bỏ ngoặc và gộp các số hạng đồng dạng.','Khai triển hoặc đổi dấu trước, rồi gộp phần biến và hằng số riêng. Thứ tự các bước giúp tránh gộp nhầm.'],
  [8,'equation','Phương trình bậc nhất một ẩn',[4,5,6],'Giải phương trình và thế nghiệm để kiểm chứng.','Thực hiện cùng một phép biến đổi ở hai vế. Khi chia, số chia phải khác 0. Thế nghiệm vào phương trình ban đầu để kiểm tra.'],
  [8,'identity8','Hằng đẳng thức đáng nhớ',[1,2,3],'Nhận diện bình phương một tổng và hiệu hai bình phương.','Bình phương một tổng có số hạng hai lần tích ở giữa. Tích một tổng và một hiệu cùng hai số hạng cho hiệu hai bình phương.'],
  [8,'pythagoras8','Định lý Pythagore',[1,2,3],'Tìm độ dài còn thiếu của tam giác vuông.','Bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông. Chỉ áp dụng khi có căn cứ tam giác vuông.'],
  [9,'roots9','Căn bậc hai và điều kiện',[1,2,3],'Tính căn số học và tránh nhầm căn của bình phương.','Căn bậc hai số học không âm. Căn của bình phương một số bằng giá trị tuyệt đối của số đó. Không tách căn của tổng thành tổng hai căn.'],
  [9,'systems9','Giải hệ bằng phương pháp cộng',[1,2,3],'Khử một ẩn rồi tìm ẩn còn lại.','Cộng hoặc trừ hai phương trình khi hệ số của một ẩn cho phép khử ẩn đó. Nghiệm tìm được phải thỏa cả hai phương trình.'],
  [9,'quadratic9','Biệt thức và nghiệm bậc hai',[1,2,3],'Tính biệt thức, phân biệt nghiệm kép và hai nghiệm.','Với hệ số bậc hai khác 0, tính biệt thức trước. Biệt thức dương cho hai nghiệm thực, bằng 0 cho nghiệm kép, âm thì không có nghiệm thực.'],
  [9,'trig9','Sin, cos, tan của góc nhọn',[1,2,3],'Xác định cạnh đối, kề và huyền theo góc đang xét.','Trong tam giác vuông, sin bằng đối/huyền, cos bằng kề/huyền, tan bằng đối/kề. Đổi góc đang xét thì cạnh đối và kề thay đổi vai trò.'],
  [9,'circle9','Đường tròn và góc nội tiếp',[1,2,3],'Phân biệt bán kính, đường kính, chu vi, diện tích và góc nội tiếp.','Chu vi phụ thuộc bán kính, diện tích phụ thuộc bình phương bán kính. Góc nội tiếp bằng nửa số đo cung bị chắn.']
];
export const demoLessons=topics.map(([grade,skill,title,indices,objective,theory],i)=>({id:`demo-v1-${grade}-${String(i%5+1)}`,grade,skill,title,objective,theory,duration:15,exerciseIds:indices.map(n=>`${skill}-${n}`),order:i%5+1}));
export function lessonExample(lesson){return exercises.find(e=>e.id===lesson.exerciseIds[0]);}
export const demoSummary=[6,7,8,9].map(grade=>({grade,lessons:demoLessons.filter(l=>l.grade===grade).length,exercises:demoLessons.filter(l=>l.grade===grade).flatMap(l=>l.exerciseIds).length}));
