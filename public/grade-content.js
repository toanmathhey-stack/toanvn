// Small authored topic banks, not a claim of complete textbook coverage.
export const gradeSkills=[
  ['fractions6','Phân số',6],['percent6','Tỉ số phần trăm',6],['area6','Diện tích hình phẳng',6],
  ['ratio7','Đại lượng tỉ lệ thuận',7],['angles7','Góc trong tam giác',7],
  ['identity8','Hằng đẳng thức',8],['pythagoras8','Định lý Pythagore',8],
  ['roots9','Căn bậc hai',9],['systems9','Hệ phương trình bậc nhất hai ẩn',9],['quadratic9','Phương trình bậc hai',9],['trig9','Tỉ số lượng giác góc nhọn',9],['circle9','Đường tròn',9]
].map(([id,name,grade],i)=>({id,name,short:name,grades:[grade],color:['#6e71db','#338b76','#c7883d','#528bc2'][i%4],prerequisite:null}));
const banks={
  fractions6:[
    ['Tính \\(\\frac12+\\frac13\\).','2/5','5/6','Quy đồng mẫu số 6: \\(\\frac36+\\frac26=\\frac56\\).'],
    ['Tính \\(\\frac34-\\frac12\\).','2/2','1/4','Quy đồng: \\(\\frac34-\\frac24=\\frac14\\).'],
    ['Tính \\(\\frac23\\cdot\\frac35\\).','5/8','2/5','Nhân tử với tử, mẫu với mẫu rồi rút gọn: \\(\\frac6{15}=\\frac25\\).']
  ],
  percent6:[
    ['Tính 25% của 80.','80/25','20','Lấy 80 nhân với \\(25/100\\), không chia cho 25.'],
    ['Lớp có 40 học sinh, 30% tham gia câu lạc bộ. Có bao nhiêu học sinh tham gia?','30','12','Tính \\(40\\cdot30/100=12\\).'],
    ['Áo giá 200 nghìn đồng giảm 15%. Giá mới là bao nhiêu nghìn đồng?','185','170','Số tiền giảm là 30 nghìn đồng; giá mới bằng 200 trừ 30.']
  ],
  area6:[
    ['Hình chữ nhật dài 8 cm, rộng 3 cm. Diện tích bằng bao nhiêu cm²?','22','24','Diện tích bằng chiều dài nhân chiều rộng; 22 cm là chu vi.'],
    ['Tam giác có đáy 10 cm, chiều cao tương ứng 4 cm. Diện tích bằng bao nhiêu cm²?','40','20','Diện tích tam giác bằng một nửa tích đáy và chiều cao.'],
    ['Hình vuông cạnh 5 cm. Diện tích bằng bao nhiêu cm²?','20','25','Diện tích bằng bình phương cạnh, không phải bốn lần cạnh.']
  ],
  ratio7:[
    ['Biết y tỉ lệ thuận với x, khi x = 2 thì y = 6. Khi x = 5, y bằng bao nhiêu?','9','15','Hệ số tỉ lệ là 6 : 2 = 3; do đó y = 3x.'],
    ['Mua 3 quyển vở hết 24 nghìn đồng. Cùng đơn giá, 5 quyển hết bao nhiêu nghìn đồng?','26','40','Mỗi quyển giá 8 nghìn đồng. Nhân đơn giá với số quyển.'],
    ['Biết y = 4x. Khi x = 3, y bằng bao nhiêu?','7','12','Tỉ lệ thuận dùng phép nhân hệ số, không cộng hệ số.']
  ],
  angles7:[
    ['Tam giác có hai góc 50° và 60°. Góc còn lại bằng bao nhiêu độ?','110','70','Tổng ba góc trong tam giác bằng 180°.'],
    ['Tam giác vuông có một góc nhọn 35°. Góc nhọn còn lại bằng bao nhiêu độ?','145','55','Hai góc nhọn trong tam giác vuông có tổng bằng 90°.'],
    ['Tam giác cân có góc ở đỉnh 40°. Mỗi góc ở đáy bằng bao nhiêu độ?','140','70','Hai góc ở đáy bằng nhau, tổng bằng 180° trừ góc đỉnh.']
  ],
  identity8:[
    ['Trong khai triển \\((x+3)^2=x^2+bx+9\\), hệ số b bằng bao nhiêu?','3','6','Bình phương một tổng có số hạng giữa bằng hai lần tích hai số hạng.'],
    ['Tính \\(21^2\\) bằng hằng đẳng thức bình phương một tổng.','401','441','Viết \\((20+1)^2=400+40+1\\); không bỏ số hạng giữa.'],
    ['Tính \\(19\\cdot21\\) bằng hiệu hai bình phương.','400','399','Viết \\((20-1)(20+1)=20^2-1^2=399\\).']
  ],
  pythagoras8:[
    ['Tam giác vuông có hai cạnh góc vuông 3 cm và 4 cm. Cạnh huyền dài bao nhiêu cm?','7','5','Bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông.'],
    ['Tam giác vuông có cạnh huyền 13 cm và một cạnh góc vuông 5 cm. Cạnh góc vuông kia dài bao nhiêu cm?','8','12','Bình phương cạnh cần tìm bằng \\(13^2-5^2=144\\).'],
    ['Tam giác vuông có hai cạnh góc vuông 6 cm và 8 cm. Cạnh huyền dài bao nhiêu cm?','14','10','Lấy căn bậc hai số học của \\(6^2+8^2=100\\).']
  ],
  roots9:[
    ['Tính \\(\\sqrt{(-5)^2}\\).','-5','5','Dùng \\(\\sqrt{a^2}=|a|\\); căn bậc hai số học luôn không âm.'],
    ['Tính \\(\\sqrt{36}+\\sqrt{64}\\).','10','14','Tính từng căn rồi cộng: 6 + 8 = 14. Không gộp thành căn của tổng.'],
    ['Tính \\(\\sqrt{12}\\cdot\\sqrt3\\).','15','6','Với hai số không âm, tích hai căn bằng căn của tích: \\(\\sqrt{36}=6\\).']
  ],
  systems9:[
    ['Cho hệ \\(\\begin{cases}x+y=5\\\\x-y=1\\end{cases}\\). Nhập giá trị x.','6','3','Cộng hai phương trình được 2x = 6, rồi chia hai vế cho 2.'],
    ['Cho hệ \\(\\begin{cases}x+y=7\\\\x-y=3\\end{cases}\\). Nhập giá trị y.','5','2','Cộng hai phương trình được x = 5, sau đó y = 7 - 5 = 2.'],
    ['Cho hệ \\(\\begin{cases}2x+y=8\\\\x-y=1\\end{cases}\\). Nhập giá trị x.','9','3','Cộng hai phương trình được 3x = 9, rồi chia cho 3.']
  ],
  quadratic9:[
    ['Với phương trình \\(x^2-5x+6=0\\), tính \\(\\Delta=b^2-4ac\\).','49','1','Ở đây a = 1, b = -5, c = 6; biệt thức bằng 25 - 24 = 1.'],
    ['Phương trình \\(x^2-5x+6=0\\) có hai nghiệm. Nhập nghiệm lớn hơn.','5','3','Phân tích thành \\((x-2)(x-3)=0\\); hai nghiệm là 2 và 3.'],
    ['Phương trình \\(x^2-4x+4=0\\) có nghiệm kép. Nhập nghiệm đó.','4','2','Viết \\((x-2)^2=0\\) hoặc dùng công thức nghiệm kép.']
  ],
  trig9:[
    ['Tam giác ABC vuông tại A, AB = 3, AC = 4, BC = 5. Tính sin B (nhập phân số).','3/5','4/5','Cạnh đối góc B là AC, cạnh huyền là BC; sin B = AC/BC.'],
    ['Tam giác ABC vuông tại A, AB = 3, AC = 4, BC = 5. Tính cos B (nhập phân số).','4/5','3/5','Cạnh kề góc B là AB, cạnh huyền là BC; cos B = AB/BC.'],
    ['Tam giác ABC vuông tại A, AB = 3, AC = 4. Tính tan B (nhập phân số).','3/4','4/3','Tan bằng cạnh đối chia cạnh kề của góc đang xét.']
  ],
  circle9:[
    ['Đường tròn bán kính 3 cm có chu vi \\(k\\pi\\) cm. Nhập k.','9','6','Chu vi bằng \\(2\\pi r\\), không phải diện tích \\(\\pi r^2\\).'],
    ['Hình tròn đường kính 8 cm có diện tích \\(k\\pi\\) cm². Nhập k.','64','16','Bán kính bằng nửa đường kính, tức 4 cm; bình phương bán kính là 16.'],
    ['Góc nội tiếp chắn cung có số đo 100°. Góc nội tiếp bằng bao nhiêu độ?','100','50','Số đo góc nội tiếp bằng nửa số đo cung bị chắn.']
  ]
};
export const gradeExercises=gradeSkills.flatMap(skill=>banks[skill.id].map(([prompt,wrong,answer,rule],i)=>({id:`${skill.id}-${i+1}`,skill:skill.id,grades:skill.grades,prompt,richPrompt:true,wrong,answer,rule,keywords:['quy tac','cong','nhan','chia','can','goc'],level:i===0?'Khởi động':i===1?'Luyện tập':'Vận dụng'})));
export const normalizeGrade=value=>[6,7,8,9].includes(Number(value))?Number(value):7;
