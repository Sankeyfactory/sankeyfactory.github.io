import fs from 'fs';
import path from 'path';

// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import gameData from '../../../dist/GameData/Satisfactory.json';

let resourcesDir = process.env["RESOURCES_DIR"];

if (resourcesDir == undefined)
{
    throw Error(
        "RESOURCES_DIR environment variable should be set to launch the tool.\n\n"
        + "If you use FModel for exporting, use Path-To-FModel/Output/Exports/FactoryGame/Content"
    );
}

let pathsMap = new Map<string, string>();

class Image
{
    constructor(
        public path: string,
        public resolution: number,
    )
    { }

    static fromPath(path: string): Image | undefined
    {
        let resolutionRegex = /(?<resolution>\d+)\.png/;
        let match = resolutionRegex.exec(path);

        if (match == null)
        {
            return undefined;
        }

        let { resolution } = match.groups!;

        return { path: path, resolution: +resolution };
    }
};

fs.readdir(resourcesDir, { withFileTypes: true, recursive: true }, (err, files) =>
{
    if (err) throw err;

    files.forEach(file =>
    {
        let parentPath = path.relative(resourcesDir, file.parentPath);
        let originalPath = `${parentPath}/${file.name}`;

        if (file.isFile())
        {
            let resultingPath = getResultingPath(originalPath);

            if (resultingPath != undefined)
            {
                let existingEntry = pathsMap.get(resultingPath);

                if (existingEntry != undefined)
                {
                    let existing = Image.fromPath(existingEntry);
                    let original = Image.fromPath(originalPath);

                    if (existing != undefined && original != undefined)
                    {
                        // If we have multiple icons for one thing, prefer the 256px one.
                        if (existing.resolution != 256 && original.resolution == 256)
                        {
                            pathsMap.set(resultingPath, originalPath);
                        }
                        else if (existing.resolution != 256)
                        {
                            console.warn(`Conflict: "${originalPath}" and "${existingEntry}"`);
                        }
                    }
                }
                else
                {
                    pathsMap.set(resultingPath, originalPath);
                }
            }
        }
    });
});

let destinationDir = "dist/GameData/SatisfactoryIcons";

let copyIcons = (gameDataEntity: { iconPath: string; }) =>
{
    let realIconPath = pathsMap.get(gameDataEntity.iconPath);

    if (realIconPath == undefined)
    {
        console.warn(`Couldn't find real icon path ${gameDataEntity.iconPath}`);
    }
    else
    {
        let sourcePath = `${resourcesDir}/${realIconPath}`;
        let destinationPath = `${destinationDir}/${gameDataEntity.iconPath}`;

        fs.mkdirSync(path.parse(destinationPath).dir, { recursive: true });

        fs.copyFile(sourcePath, destinationPath, (err) =>
        {
            if (err) throw err;

            console.log(`Copied: ${sourcePath} to ${destinationPath}`);
        });
    }
};

gameData.machines.forEach(copyIcons);
gameData.resources.forEach(copyIcons);

function getResultingPath(originalPath: string): string | undefined
{
    if (originalPath === "FactoryGame/IconDesc_PortableMiner_256.png")
    {
        return "Equipment/PortableMiner/PortableMiner.png";
    }
    else if (originalPath !== "None")
    {
        let iconRegex = /FactoryGame\/(?<path>[\w-/]+?\/)(?:IconDesc_)?(?<name>\w+?)(?:_\d+)?\.png/;

        let match = iconRegex.exec(originalPath);

        if (match == null)
        {
            return undefined;
        }

        let { path, name } = match.groups!;

        return `${path.replace("UI/", "")}${name}.png`;
    }

    return undefined;
}
