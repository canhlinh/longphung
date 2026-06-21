console.error(
  [
    'This image is the slim app runtime and cannot run Payload maintenance scripts.',
    '',
    'Use the tooling image instead:',
    '  ghcr.io/canhlinh/longphung:main-tooling',
    '',
    'Examples:',
    '  docker run --rm -e DATABASE_URL=... -e PAYLOAD_SECRET=... ghcr.io/canhlinh/longphung:main-tooling npm run seed',
    '  docker run --rm -e DATABASE_URL=... -e PAYLOAD_SECRET=... ghcr.io/canhlinh/longphung:main-tooling npm run migrate:run',
  ].join('\n'),
)

process.exit(1)
