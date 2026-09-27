# MUTQAN Home v1

## الملفات
- `home.html` — HTML للرئيسية
- `home.css` — CSS للرئيسية
- `home.js` — JavaScript للرئيسية، يقرأ من REST API
- `home-supervisor.html` — HTML لمشرف الرئيسية
- `home-supervisor.css` — CSS لمشرف الرئيسية
- `home-supervisor.js` — JavaScript للمشرف، يقرأ ويحفظ عبر REST API
- `mutqan-home-bridge.php` — طبقة Backend/REST داخل WordPress

## Backend
Endpoint:
`/wp-json/mutqan/v1/home`

GET متاح لقراءة إعدادات الرئيسية.
POST يتطلب صلاحية `manage_options`.

هذه الطبقة هي بداية الـMUTQAN Core للربط. الصفحات التالية ستستخدم نفس طبقة البيانات بدل إنشاء مخازن منفصلة لكل صفحة.
