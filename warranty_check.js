// 產品保固年限設定 (根據產品型號)
const warrantyPeriods = {
    "E004": 12,  // 1年保固
    "E005": 24,  // 2年保固
    "E006": 12,  // 1年保固
    "E007": 24   // 2年保固
    // 可繼續添加其他型號...
};

// DOM元素
const queryBtn = document.getElementById('queryBtn');
const serialNumberInput = document.getElementById('serialNumber');
const resultDiv = document.getElementById('result');

// 查詢按鈕點擊事件
queryBtn.addEventListener('click', checkWarranty);

// 保固檢查函數
function checkWarranty() {
    const serialNumber = serialNumberInput.value.trim().toUpperCase();
    
    if (!serialNumber) {
        alert('請輸入產品序號');
        return;
    }

    // 檢查是否為舊版序號 (長度不足12或沒有E開頭)
    if (serialNumber.length < 12) {
        showResult('舊版序號或無效序號，請洽詢客服人員', false);
        return;
    }

    // 提取產品型號 (前4碼)
    const productModel = serialNumber.substring(0, 4);
    
    // 檢查是否為有效型號
    if (!warrantyPeriods.hasOwnProperty(productModel)) {
        showResult('無效序號，請檢查序號是否正確', false);
        return;
    }

    // 提取購買日期 (末8碼)
    const purchaseDateStr = serialNumber.slice(-8);
    
    // 檢查是否為有效日期格式 (全數字)
    if (!/^\d{8}$/.test(purchaseDateStr)) {
        showResult('序號格式錯誤，請檢查序號是否正確', false);
        return;
    }

	// 解析購買日期 (格式: MMDDYYYY)
	const month = parseInt(purchaseDateStr.substring(0, 2)) - 1; // 月份是0-11
	const day = parseInt(purchaseDateStr.substring(2, 4));
	const year = parseInt(purchaseDateStr.substring(4, 8));


    
    // 驗證日期是否有效
    const purchaseDate = new Date(year, month, day);
    if (isNaN(purchaseDate.getTime()) || 
        purchaseDate.getFullYear() !== year ||
        purchaseDate.getMonth() !== month ||
        purchaseDate.getDate() !== day) {
        showResult('無效序號，請檢查序號是否正確', false);
        return;
    }

    // 檢查購買日期是否在未來
    const currentDate = new Date();
    if (purchaseDate > currentDate) {
        showResult('無效序號，請檢查序號是否正確', false);
        return;
    }

    // 計算保固到期日
    const warrantyMonths = warrantyPeriods[productModel];
    const warrantyEndDate = new Date(purchaseDate);
    warrantyEndDate.setMonth(purchaseDate.getMonth() + warrantyMonths);
    
    // 比較日期
    if (currentDate > warrantyEndDate) {
        showResult(`此產品已過保 (${warrantyMonths}個月保固，到期日: ${formatDate(warrantyEndDate)})`, false);
    } else {
        const daysLeft = Math.ceil((warrantyEndDate - currentDate) / (1000 * 60 * 60 * 24));
        showResult(`此產品在保固期內 (${warrantyMonths}個月保固，剩餘 ${daysLeft} 天，到期日: ${formatDate(warrantyEndDate)})`, true);
    }
}

// 顯示結果函數
function showResult(message, isValid) {
    resultDiv.textContent = message;
    resultDiv.className = isValid ? 'valid' : 'expired';
    resultDiv.style.display = 'block';
}

// 日期格式化函數
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 按Enter鍵也可查詢
serialNumberInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkWarranty();
    }
});