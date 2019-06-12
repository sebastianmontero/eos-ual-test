import { Asset } from '../domain';

const parseAssetRegex = /^\s*(-?\d+.?\d*)\s*([a-zA-Z]+)\s*$/;

class EOSUtil {

    static getTypePath(account, type) {
        return `${account}/${type}`;
    }

    static parseTypePath(typePath) {
        const parts = typePath.split('/');
        return {
            account: parts[0],
            type: parts[1],
        };
    }

    static parseTablePath(fullPath) {
        const parts = fullPath.split('/');
        return {
            account: parts[0],
            scope: parts[1],
            table: parts[2],
            index: parts[3],
        };
    }

    static getShortTablePath(fullPath) {
        const { account, table } = EOSUtil.parseTablePath(fullPath);
        return `${account}/${table}`;
    }

    static stringToAsset(value) {
        const result = parseAssetRegex.exec(value);
        if (!result) {
            throw new Error('String is not a valid Asset');
        }
        return new Asset(result[1], result[2]);
    }

}

EOSUtil.blocksPerDay = (2 * 60 * 60 * 24);

export default EOSUtil;