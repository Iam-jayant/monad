
const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    console.error("Pinata API keys are missing! Check your .env file.");
}

export const uploadFileToIPFS = async (file: File): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Pinata upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
};

export const uploadJSONToIPFS = async (jsonData: any): Promise<string> => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const payload = {
        pinataContent: jsonData,
        pinataMetadata: {
            name: `${jsonData.name || 'metadata'}.json`,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_API_SECRET,
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Pinata upload failed: ${response.statusText}`);
        }

        const result = await response.json();
        return `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
    } catch (error) {
        console.error('Error uploading JSON to IPFS:', error);
        throw error;
    }
};
