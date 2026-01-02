const fs = require('fs');

const data = JSON.parse(fs.readFileSync('curriculum_dump.json', 'utf8'));

const targets = ["w#백일장", "자연수,최대공약수,최소공배수", "지수법칙"];

const found = [];

data.forEach(r3 => {
    if (r3.children) {
        r3.children.forEach(r2 => {
            if (targets.includes(r2.r2listinfo)) {
                found.push({
                    title: r2.r2listinfo,
                    r2order: r2.r2order,
                    rkorder: r2.rkorder,
                    r2id: r2.r2id
                });
            }
        });
    }
});

console.log(JSON.stringify(found, null, 2));
