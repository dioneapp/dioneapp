let currentPort: number | null = null;

export const getAvailablePort = async (): Promise<number> => {
    try {
        const { default: getPort } = await import('get-port');
        const port = await getPort();
        currentPort = port;
        return port;
    } catch (error) {
        console.error('Error finding available port:', error);
        throw new Error('Unable to find available port');
    }
};

export const getCurrentPort = (): number | null => {
    return currentPort;
};
