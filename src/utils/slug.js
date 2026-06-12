import slugify from 'slugify';

export default (value) => slugify(value || '', {
  lower: true,
  strict: true,
  trim: true
});
