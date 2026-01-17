import { useEffect } from 'react';

/**
 * Custom hook to set the page title dynamically.
 * Formats title as: "بوك باس | [Page Title]"
 * @param {string} title - The specific title for the current page
 */
const usePageTitle = (title) => {
    useEffect(() => {
        document.title = `بوك باس | ${title}`;
    }, [title]);
};

export default usePageTitle;
