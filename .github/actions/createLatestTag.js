module.exports = async ({github, context, core}) => {
    // This code was borrowed from https://github.com/marvinpinto/actions/blob/9ecff5f61cbff8b2d81c3a064cb805931e730fdd/packages/automatic-releases/src/main.ts#L41-L58
    refInfo = {
      owner: context.repo.owner,
      ref: 'refs/tags/latest',
      repo: context.repo.repo,
      sha: context.sha,
    }
    core.startGroup('Generating latest release tag');
    const friendlyTagName = refInfo.ref.substring(10); // 'refs/tags/latest' => 'latest'
    core.info(`Attempting to create or update release tag "${friendlyTagName}"`);
  
    try {
      await github.rest.git.createRef(refInfo);
      core.info(`Successfully created latest release tag "${friendlyTagName}"`);
    } catch (err) {
      const existingTag = refInfo.ref.substring(5); // 'refs/tags/latest' => 'tags/latest'
      core.info(
        `Could not create new tag "${refInfo.ref}" (${err.message}) therefore updating existing tag "${existingTag}"`,
      );
      await github.rest.git.updateRef({
        ...refInfo,
        ref: existingTag,
        force: true,
      });
      core.info(`Successfully updated latest release tag "${friendlyTagName}"`);
    }
  
    core.endGroup();
  }
  