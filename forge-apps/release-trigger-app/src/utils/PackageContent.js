
export function PackageContent(featureDetails){
    const userStoriesStr = featureDetails.userStoryDescriptions.join(' ');
    return `Epic story: ${featureDetails.epicDescription} User stories: ${userStoriesStr}`;

}
