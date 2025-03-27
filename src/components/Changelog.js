import React from 'react';
import ReactMarkdown from 'react-markdown';
import changelogContent from '../data/changelog.md';
import './changelog.css';

export const ChangelogTab = () => {
    const [markdown, setMarkdown] = React.useState('');

    // Load the markdown content
    React.useEffect(() => {
        fetch(changelogContent)
            .then(response => response.text())
            .then(text => setMarkdown(text));
    }, []);

    return (
        <div className="changelog">
            <div className="changelog-container">
                <ReactMarkdown
                    children={markdown}
                    components={{
                        h1: ({node, ...props}) => <h3 className="changelog-version" {...props} />,
                        h2: ({node, ...props}) => <h4 className="changelog-section" {...props} />,
                        ul: ({node, ...props}) => <ul className="changelog-list" {...props} />,
                        li: ({node, ...props}) => <li className="changelog-item" {...props} />,
                        strong: ({node, ...props}) => <strong className="changelog-emphasis" {...props} />
                    }}
                />
            </div>
        </div>
    );
}; 