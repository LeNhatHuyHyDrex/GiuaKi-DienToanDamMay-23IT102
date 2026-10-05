function validateBook(req, res, next) {
  const { productCode, title, author, priceBeforeTax } = req.body;
  const prefix = process.env.MSSV ? process.env.MSSV.slice(-3) : '102';
  const vatRate = Number(process.env.MSSV ? process.env.MSSV.slice(-1) : 2) + 5;
  const price = Number(priceBeforeTax);
  const isEdit = !!req.params.id;
  const viewName = isEdit ? 'edit-book' : 'add-book';

  if (!productCode || !productCode.trim().startsWith(prefix)) {
    return res.status(400).render(viewName, {
      error: `Hệ thống từ chối xử lý: Mã sản phẩm bắt buộc phải có tiền tố là 3 số cuối MSSV (${prefix}).`,
      book: isEdit ? { _id: req.params.id, ...req.body } : undefined,
      oldData: req.body,
      ...pageInfo(),
    });
  }

  if (!title?.trim() || !author?.trim() || !Number.isFinite(price) || price < 0) {
    return res.status(400).render(viewName, {
      error: 'Vui lòng nhập đầy đủ và chính xác thông tin sách.',
      book: isEdit ? { _id: req.params.id, ...req.body } : undefined,
      oldData: req.body,
      ...pageInfo(),
    });
  }

  req.bookData = {
    productCode: productCode.trim(),
    title: title.trim(),
    author: author.trim(),
    priceBeforeTax: price,
    vatRate,
    priceAfterTax: Number((price * (1 + vatRate / 100)).toFixed(2)),
  };
  next();
}

function pageInfo() {
  return {
    fullName: process.env.FULL_NAME,
    mssv: process.env.MSSV,
    className: process.env.CLASS_NAME,
    vatRate: Number(process.env.MSSV ? process.env.MSSV.slice(-1) : 2) + 5,
  };
}

module.exports = { validateBook, pageInfo };
