const keyList = Array(10); // konami code
class EasterEggs {

    bootStrap() {
        // Add a key listener to the document
        document.addEventListener('keydown', (event) => {
            // Push the key to the list
            keyList.push(event.key);
            // Remove the first key from the list
            keyList.shift();
            // Check if the key list matches the konami code
            if (keyList.join('') === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
                console.log('Based')
                window.location.href = 'https://carbonhost.cloud/site-konami'
            }
        });
    }
}
export default new EasterEggs()
