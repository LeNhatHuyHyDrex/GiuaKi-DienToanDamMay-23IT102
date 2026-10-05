function validateBook(req, res, next) {
  const { productCode, title, author, priceBeforeTax } = req.body;
  const prefix = process.env.MSSV.slice(-3);
  const vatRate = Number(process.env.MSSV.slice(-1)) + 5;
  const price = Number(priceBeforeTax);

  if (!productCode || !productCode.startsWith(prefix)) {
    return res.status(400).render('add-book', {
      error: `Ma san pham phai bat dau bang ${prefix}.`,
      oldData: req.body,
      ...pageInfo(),
    });
  }

  if (!title?.trim() || !author?.trim() || !Number.isFinite(price) || price < 0) {
    return res.status(400).render('add-book', {
      error: 'Vui long nhap dung va day du thong tin sach.',
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
    vatRate: Number(process.env.MSSV.slice(-1)) + 5,
  };
}

module.exports = { validateBook, pageInfo };
