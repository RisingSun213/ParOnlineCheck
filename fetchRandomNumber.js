// Function to fetch a random number
async function fetchRandomNumber() {
    const apiUrl = "https://randomnumberfunctionapp.azurewebsites.net/api/generate_random_number_t?code=z1-qhZwhAC-N3yXGv5gO4LHYA1_Z1X3a8ly_VHyBe-UwAzFuwM2yug%3D%3D";
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Generated Random Number: ${data.randomNumber}`);

        // Display the random number on the page
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Generated Random Number: ${data.randomNumber}`;
    } catch (error) {
        console.error("Error fetching random number:", error);
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

async function fetchExistingNumbers() {
    const apiUrl = "https://randomnumberfunctionapp.azurewebsites.net/api/get_existing_numbers_t?code=y2Ds4vIcr-l9lx5MdCL_RxNyO0OS-iXVugmV1FQpxUxFAzFufH083Q%3D%3D";
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const textData = await response.text(); // 获取原始字符串
        console.log(`Raw Response: ${textData}`);

        // 提取数字部分并解析为数组
        const numbersMatch = textData.match(/Existing numbers: (.*)/); // 匹配 'Existing numbers: 后的内容'
        const numbers = numbersMatch && numbersMatch[1] ? numbersMatch[1].split(',').map(num => num.trim()) : [];

        console.log(`Parsed Numbers: ${numbers}`);

        // Display the existing numbers on the page
        const resultDiv = document.getElementById("result");
        if (numbers.length > 0) {
            resultDiv.textContent = `Existing Numbers: ${numbers.join(', ')}`;
        } else {
            resultDiv.textContent = "No numbers found.";
        }
    } catch (error) {
        console.error("Error fetching existing numbers:", error);
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Error: ${error.message}`;
    }
}

// Add event listeners to buttons
document.getElementById("fetchNumberButton").addEventListener("click", fetchRandomNumber);
document.getElementById("fetchExistingNumbersButton").addEventListener("click", fetchExistingNumbers);
