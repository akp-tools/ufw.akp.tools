function parseUfwSegment(segment) {
  const [first, second] = segment.split('=');
  switch (first) {
    case 'SRC':
      return ['src_ip', second];
    case 'DST':
      return ['dest_ip', second];
    case 'PROTO':
      return ['protocol', second];
    case 'SPT':
      return ['src_port', Number(second)];
    case 'DPT':
      return ['dest_port', Number(second)];
    default:
  }
  return null;
}

module.exports = {
  parseUfwSegment,
};
