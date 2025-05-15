// 📁 MouseTracker.js


/* ─────────────────────────────
 ✅ كائن تتبع حركة الماوس داخل الكابتشا
 ───────────────────────────── */
export const MouseTracker = {
    // المتغيرات العامة لحفظ الحالة
    entryTime: null,            // وقت دخول الماوس إلى المربع
    speedLog: [],               // قائمة بسرعات الحركة الأخيرة
    maxSpeed: 0,                // أعلى سرعة تم رصدها
    suddenStopCount: 0,        // عدد التوقفات المفاجئة
    trackingActive: false,     // هل التتبع نشط؟

    /* ─────────────
     ✅ عند دخول المستخدم للمربع
     ───────────── */
    startTracking(event) {
        this.entryTime = Date.now();    // نسجل وقت الدخول
        this.speedLog = [];             // نبدأ سجل سرعات جديد
        this.maxSpeed = 0;
        this.suddenStopCount = 0;
        this.trackingActive = true;
    },

    /* ─────────────
     ✅ تتبع كل حركة للماوس داخل المربع
     ───────────── */
    trackMovement(event) {
        if (!this.trackingActive) return;

        let dx = event.movementX;
        let dy = event.movementY;
        let speed = Math.sqrt(dx * dx + dy * dy); // نحسب سرعة اللحظة

                                                               //     console.log("🟡 speed:", speed);   // all speed record

        if (speed > 0.5) { // تجاهل الحركات الصغيرة جدًا
            this.speedLog.push(speed);

            if (speed > this.maxSpeed)
                this.maxSpeed = speed;

            // تحقق من التوقف المفاجئ
            if (
                this.speedLog.length > 1 &&
                this.speedLog[this.speedLog.length - 2] > 0.8  &&
                speed < 0.1
            ) {
                this.suddenStopCount++;
            }

            // احتفظ فقط بـ آخر 10 سرعات
            if (this.speedLog.length > 10)
                this.speedLog.shift();
        }
    },



    
    /* ─────────────
     ✅ عند النقر: تحليل حركة المستخدم
     ───────────── */
    handleClick(event) {
       if (!this.trackingActive || this.speedLog.length < 5) return null;


        let clickTime = Date.now();
        let movementTime = clickTime - this.entryTime;

        // آخر سرعة
        let lastSpeed = this.speedLog.at(-1) || 0;

        // حساب معدل التباطؤ
        let lastSpeeds = this.speedLog.slice(-5);
        let avgLastSpeed = lastSpeeds.length > 0
            ? lastSpeeds.reduce((a, b) => a + b, 0) / lastSpeeds.length
            : 0;

        let decelerationRate = avgLastSpeed > 0
            ? (avgLastSpeed - lastSpeed) / avgLastSpeed
            : 0;

        decelerationRate = Math.max(0, parseFloat(decelerationRate.toFixed(2)));

        // حساب مدى استقرار السرعة
        let meanSpeed = this.speedLog.length > 0
            ? this.speedLog.reduce((a, b) => a + b, 0) / this.speedLog.length
            : 0;

        let variance = this.speedLog.length > 1
            ? this.speedLog.reduce((sum, s) => sum + Math.pow(s - meanSpeed, 2), 0) / this.speedLog.length
            : 0;

        let speedStability = parseFloat(Math.sqrt(variance).toFixed(2));

        // تحليل نمط الحركة
        let movementPattern = "normal";
        if (speedStability < 0.1) movementPattern = "too stable";
        else if (speedStability > 2.0) movementPattern = "chaotic";




                                // تحليل السلوك الأولي
                                let behaviorType = "human";

                                // منطق الاشتباه
                                let suspiciousScore = 0;
                                if (movementTime < 200) suspiciousScore++;
                                if (speedStability < 0.1) suspiciousScore++;
                                if (decelerationRate < 0.2) suspiciousScore++;
                                if (this.suddenStopCount > 3) suspiciousScore++;

                                // لو فيه مؤشرات كافية للاشتباه، نصنّف كروبوت
                                if (suspiciousScore >= 2) {
                                behaviorType = "robot";
                                                }


                                    // تجميع البيانات النهائية
                                    let jsonData = {
                                        maxSpeed: parseFloat(this.maxSpeed.toFixed(2)),
                                        lastSpeed: parseFloat(lastSpeed.toFixed(2)),
                                        speedStability,
                                        movementTime,
                                     //   behaviorType, // "human" أو "robot"
                                        pageUrl: window.location.href,
                                        userAgent: navigator.userAgent,
                                        speedSeries: this.speedLog.slice(-10)  // 🟢 السطر الجديد المهم
                                    };



   

      this.trackingActive = false;
      this.speedLog = [];

      return jsonData;

    }



};





