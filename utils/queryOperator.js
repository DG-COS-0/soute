class queryOperator {
  constructor(query, secondQuery) {
    this.query = query;
    this.secondQuery = secondQuery;
  }
  sort() {
    if (this.secondQuery.sort) {
      const sortBy = this.secondQuery.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.secondQuery };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  limitFields() {
    if (this.secondQuery.fields) {
      const fields = this.secondQuery.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const count = this.secondQuery.count * 1 || 5;
    const page = this.secondQuery.page * 1 || 1;
    const limit = this.secondQuery.limit * 1 || count;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = queryOperator;
