import React from 'react';

const MailCTA = () => {
    const handleClick = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText('hello@albyeah.com')
                .then(() => {
                    console.log('Email address copied to clipboard');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                });
        } else {
            // Fallback for older browsers or mobile devices
            const textArea = document.createElement('textarea');
            textArea.value = 'hello@albyeah.com';
            textArea.style.position = 'fixed';  // Avoid scrolling to bottom
            textArea.style.opacity = '0';  // Make it invisible
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                console.log('Email address copied to clipboard');
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
            document.body.removeChild(textArea);
        }
    };

    return (
        <button onClick={handleClick} className='font-sans bg-white rounded-2xl text-8xl py-4 px-8 md:py-8 md:px-12 btn-primary text-[7.325vw]' >
            hello@albyeah.com
        </button>
    );
};

export default MailCTA;