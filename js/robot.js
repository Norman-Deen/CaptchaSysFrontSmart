//1-querySelector()
(() => {
    console.log("🤖QuerySelector Robot is running...");

    // ✅ البحث عن أول `checkbox` في الصفحة
    const firstCheckbox = document.querySelector('input[type="checkbox"]');

    if (firstCheckbox) {
        firstCheckbox.click();
        console.log("🤖 Clicked on:", firstCheckbox);
    } else {
        console.warn("❌ No checkboxes found!");
    }
})();


//2-getBoundingClientRect()
(() => {
    console.log("🤖 Robot is running...");

    // ✅ البحث عن جميع المربعات في الصفحة
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found!");
        return;
    }

    let bestCheckbox = null;
    let bestDistance = Infinity; // ✅ المسافة الافتراضية كبيرة جدًا لضمان أن أول مقارنة تكون صحيحة

    checkboxes.forEach((checkbox) => {
        const rect = checkbox.getBoundingClientRect();
        console.log(`📍 Checkbox at X: ${rect.x}, Y: ${rect.y}`);

        // ✅ حساب المسافة من منتصف الصفحة
        let distance = Math.sqrt(
            Math.pow(rect.x - window.innerWidth / 2, 2) +
            Math.pow(rect.y - window.innerHeight / 2, 2)
        );

        // ✅ اختيار المربع الأقرب إلى منتصف الصفحة
        if (distance < bestDistance) {
            bestCheckbox = checkbox;
            bestDistance = distance;
        }
    });

    if (bestCheckbox) {
        bestCheckbox.click();
        console.log("🤖 Clicked on:", bestCheckbox);
    } else {
        console.warn("❌ No valid checkbox found!");
    }
})();




//3-window.getComputedStyle()
(() => {
    console.log("🤖 Robot is running...");

    // ✅ البحث عن جميع المربعات في الصفحة
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found!");
        return;
    }

    let bestCheckbox = null;
    let bestScore = -Infinity;

    checkboxes.forEach((checkbox) => {
        const style = window.getComputedStyle(checkbox);

        console.log(`📍 Analyzing Checkbox:`);
        console.log(`   - Opacity: ${style.opacity}`);
        console.log(`   - Visibility: ${style.visibility}`);
        console.log(`   - Display: ${style.display}`);
        console.log(`   - Pointer Events: ${style.pointerEvents}`);
        console.log(`   - Transform: ${style.transform}`);
        console.log(`   - Filter: ${style.filter}`);

        // ✅ حساب "نقاط" لكل مربع بناءً على خصائصه
        let score = 0;

        if (style.opacity === "1") score += 10; // إذا كان مرئيًا بالكامل
        if (style.visibility !== "hidden") score += 5; // إذا لم يكن مخفيًا
        if (style.display !== "none") score += 5; // إذا كان معروضًا
        if (style.pointerEvents !== "none") score += 5; // إذا كان قابلًا للنقر

        // إذا كان هذا المربع الأفضل حتى الآن، نقوم بتحديث الاختيار
        if (score > bestScore) {
            bestScore = score;
            bestCheckbox = checkbox;
        }
    });

    if (bestCheckbox) {
        bestCheckbox.click();
        console.log("🤖 Clicked on:", bestCheckbox);
    } else {
        console.warn("❌ No valid checkbox found!");
    }
})();



//4- روبوت تجاوز قياس الزمن بين النقرات
(() => {
    console.log("🤖 Test Robot (Fast Click Tester) is running...");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found!");
        return;
    }

    let index = 0;

    function clickFast() {
        if (index >= checkboxes.length) {
            console.log("✅ Test Completed: All checkboxes clicked rapidly.");
            return;
        }

        let checkbox = checkboxes[index];

        setTimeout(() => {
            checkbox.click();
            console.log(`🤖 Clicked on: ${checkbox} (Fast Mode)`);
            index++;
            clickFast();
        }, 50); // ⏳ وقت قصير جدًا (50ms) لاختبار الحماية ضد النقرات السريعة
    }

    clickFast();
})();


//5- روبوت تجاوز منع النقرات البرمجية (event.isTrusted)
(() => {
    console.log("🤖 Test Robot (Bypass event.isTrusted) is running...");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found!");
        return;
    }

    checkboxes.forEach((checkbox) => {
        checkbox.click(); // 🔥 محاولة تنفيذ النقر برمجيًا
        console.log("🤖 Programmatic Click Attempted on:", checkbox);
    });
})();




//6-روبوت محاكاة حركة الفأر البشري
(async () => {
    console.log("🤖 Robot 6 (Upgraded Human-like Simulation) is running...");

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found!");
        return;
    }

    // ✅ إيجاد المربع الأقرب لمركز الشاشة
    let bestCheckbox = null;
    let bestDistance = Infinity;

    checkboxes.forEach((checkbox) => {
        const rect = checkbox.getBoundingClientRect();
        const distance = Math.sqrt(
            Math.pow(rect.x - window.innerWidth / 2, 2) +
            Math.pow(rect.y - window.innerHeight / 2, 2)
        );
        if (distance < bestDistance) {
            bestDistance = distance;
            bestCheckbox = checkbox;
        }
    });

    if (!bestCheckbox) {
        console.warn("❌ No suitable checkbox found.");
        return;
    }

    const rect = bestCheckbox.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2 + (Math.random() * 4 - 2); // ⬅️ ليس في المركز تماماً
    const targetY = rect.top + rect.height / 2 + (Math.random() * 4 - 2);

    // 🐢 إعداد الحركة
    const steps = 30;
    const delay = 15;
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    const moveMouse = (x, y) => {
        const evt = new MouseEvent("mousemove", {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.dispatchEvent(evt);
    };

    for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const nextX = startX + (targetX - startX) * progress;
        const nextY = startY + (targetY - startY) * progress;
        moveMouse(nextX, nextY);
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    // 🖱️ محاولة النقر البرمجي
    const clickEvent = new MouseEvent("click", {
        clientX: targetX,
        clientY: targetY,
        bubbles: true,
        cancelable: true,
        view: window
    });

    bestCheckbox.dispatchEvent(clickEvent);
    console.log("✅ Simulated click dispatched on target checkbox.");
})();





//7 – Randomized Human Emulation: يُحاكي المستخدم البشري بالكامل بتحريك الماوس عشوائيًا، والتوقف لحظات متفاوتة، وتجربة مربعات متعددة بسرعة واقعية.
(async () => {
    console.log("🤖 Robot 7 (Randomized Human Emulation) is running...");

    const checkboxes = document.querySelectorAll("#checkbox-container input");
    if (checkboxes.length === 0) {
        console.warn("❌ No checkboxes found.");
        return;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 🌀 يحرك الماوس بشكل عشوائي داخل الحاوية
    const moveMouseRandomly = async (targetElement) => {
        const rect = targetElement.getBoundingClientRect();

        for (let i = 0; i < 10; i++) {
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;

            const moveEvent = new MouseEvent("mousemove", {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true,
                view: window
            });

            document.dispatchEvent(moveEvent);
            await delay(50 + Math.random() * 100); // تأخير عشوائي
        }
    };

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];

        console.log(`🔍 Trying checkbox #${i + 1}`);

        // 🧭 حرك الماوس بشكل عشوائي فوقه
        await moveMouseRandomly(checkbox);

        // ⏳ توقف لحظة كأنه متردد
        await delay(300 + Math.random() * 300);

        // 🖱️ نفّذ نقر بشري
        const rect = checkbox.getBoundingClientRect();
        const clickX = rect.left + rect.width / 2 + (Math.random() * 2 - 1); // انحراف بسيط
        const clickY = rect.top + rect.height / 2 + (Math.random() * 2 - 1);

        const clickEvent = new MouseEvent("click", {
            clientX: clickX,
            clientY: clickY,
            bubbles: true,
            cancelable: true,
            view: window
        });

        checkbox.dispatchEvent(clickEvent);

        await delay(500 + Math.random() * 500); // ⏱ مهلة كأنه ينتظر النتيجة

        if (!document.body.contains(checkbox)) {
            console.log("✅ Checkbox removed, probably real one!");
            break;
        }
    }

    console.log("🤖 Robot 7 finished.");
})();





// 8 - Smart AI Simulation
(async () => {
    console.log("🤖 Robot 8 (Smart AI Simulation) is running...");

    const delay = ms => new Promise(res => setTimeout(res, ms));
    const container = document.querySelector("#checkbox-container");
    const checkboxes = container?.querySelectorAll("input");

    if (!checkboxes || checkboxes.length === 0) {
        console.warn("❌ No checkboxes found.");
        return;
    }

    const moveMouseSmoothly = async (x1, y1, x2, y2, steps = 40) => {
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const x = x1 + (x2 - x1) * t + Math.random();
            const y = y1 + (y2 - y1) * t + Math.random();

            const moveEvent = new MouseEvent("mousemove", {
                clientX: x,
                clientY: y,
                bubbles: true,
                cancelable: true,
                view: window
            });

            document.dispatchEvent(moveEvent);
            await delay(10 + Math.random() * 10);
        }
    };

    const simulateClick = (x, y, target) => {
        const clickEvent = new MouseEvent("click", {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
            view: window
        });
        target.dispatchEvent(clickEvent); // ✅ يرسل النقر للمربع الصحيح
    };

    const screenCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };

    for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];
        const rect = checkbox.getBoundingClientRect();

        const targetX = rect.left + rect.width / 2 + (Math.random() * 3 - 1.5);
        const targetY = rect.top + rect.height / 2 + (Math.random() * 3 - 1.5);

        console.log(`🧠 Trying checkbox #${i + 1}...`);

        // ⬇️ حركة تدريجية من مركز الشاشة
        await moveMouseSmoothly(screenCenter.x, screenCenter.y, targetX, targetY);

        // ⏳ تردد واقعي
        await delay(300 + Math.random() * 300);

        // ⬅️ نقر على العنصر نفسه
        simulateClick(targetX, targetY, checkbox);

        // ⏱ انتظار "نتيجة" النقر
        await delay(600 + Math.random() * 400);

        const stillExists = document.body.contains(checkbox);
        if (!stillExists) {
            console.log("✅ Checkbox removed, likely real one clicked.");
            break;
        }
    }

    console.log("🤖 Robot 8 finished.");
})();




//IMPORTANT
event.isTrusted