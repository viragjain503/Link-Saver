import React, { useState, useEffect } from 'react';
import './UrlManager.css'; // Import the external CSS file
import { CopyToClipboard } from 'react-copy-to-clipboard'; // Import the copy-to-clipboard component

function UrlManager() {
  const [urlInput, setUrlInput] = useState<string>('');
  const [savedUrls, setSavedUrls] = useState<string[]>([]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const handleSaveUrl = () => {
    if (urlInput.trim() !== '') {
      let alreadyObj: any = [];
      chrome.storage.local.get(["url"], function (obj) {
        alreadyObj = obj && obj.url ? obj.url : [];
        alreadyObj.push(urlInput);
        chrome.storage.local.set({ "url": alreadyObj }, function () {
          console.log("Saved data");
        });
      });

      setSavedUrls([...savedUrls, urlInput]);
      setUrlInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveUrl();
    }
  };

  const handleDeleteUrl = (index: number) => {
    const updatedUrls = savedUrls.filter((_, i) => i !== index);
    chrome.storage.local.set({ "url": updatedUrls }, function () {
      console.log("Deleted data");
    });
    setSavedUrls(updatedUrls);
  };

  useEffect(() => {
    chrome.storage.local.get(["url"], function (obj) {
      if (obj.url) {
        setSavedUrls(obj.url);
      }
    });
  }, []);

  return (
    <div>
      <h2>URL Manager</h2>
      <div>
        <input
          type="text"
          placeholder="Enter URL"
          value={urlInput}
          onChange={handleUrlChange}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleSaveUrl}>Save</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Copy</th>
            <th>Delete</th> {/* Add a new column for the delete icon */}
          </tr>
        </thead>
        <tbody>
          {savedUrls.map((url, index) => (
            <tr key={index}>
              <td>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </td>
              <td>
                <CopyToClipboard text={url}>
                  <i className="material-icons" style={{ cursor: 'pointer', color: 'green' }}>Copy</i>
                </CopyToClipboard>
              </td>
              <td>
                <i
                  className="material-icons"
                  onClick={() => handleDeleteUrl(index)}
                  style={{ cursor: 'pointer', color: 'red' }}
                >
                  delete
                </i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrlManager;
