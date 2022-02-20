const animate = (
    duration: number,
    frameCallback: (animationProgress: number) => void | Promise<void>,
    easingFunction: (progress: number) => number = (x) => x
): Promise<void> => new Promise((resolve) => {
    let startTime: number | null = null;

    requestAnimationFrame(async function frameHandler(currentTime) {
        if (!startTime) {
            startTime = currentTime;
        }

        const timeDelta = currentTime - startTime;
        const progress = Math.min(timeDelta / duration, 1);
        const animationProgress = easingFunction(progress);

        await frameCallback(animationProgress);

        if (progress === 1) return resolve();

        requestAnimationFrame(frameHandler);
    });
});
