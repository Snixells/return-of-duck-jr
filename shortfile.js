for (let i = 1; i < 7 * 12; i++) {
    process.stdout.write(i + ",")
    if (i % 7) {
    } else {
        process.stdout.write("]");
        process.stdout.write("\n");
        process.stdout.write("[");

    }
}