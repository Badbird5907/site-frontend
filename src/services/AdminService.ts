const keyList = Array(10); // konami code
class AdminService {

    bootStrap() {
        // Add a key listener to the document
        document.addEventListener('keydown', (event) => {
            // Push the key to the list
            keyList.push(event.key);
            // Remove the first key from the list
            keyList.shift();
            // Check if the key list matches the konami code
            if (keyList.join('') === 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba') {
                // If it does, open the admin panel
                console.log('Based')
            }
        });
    }
}
export default new AdminService()
