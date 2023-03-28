const { nanoid } = require("nanoid");
const books = require("./books");

const addNewBook = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const id = nanoid(16);
	const insertedAt = new Date().toISOString();
	const updatedAt = insertedAt;
	const finished = pageCount === readPage ? true : false;

	if (name == "" || name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal menambahkan buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message:
				"Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		finished,
		reading,
		insertedAt,
		updatedAt,
	};

	books.push(newBook);

	const isSuccess = books.filter((i) => i.id === id).length > 0;

	if (isSuccess) {
		const response = h.response({
			status: "success",
			message: "Buku berhasil ditambahkan",
			data: {
				bookId: id,
			},
		});
		response.code(201);
		return response;
	}
};

const getAllBooks = (request, h) => {
	const response = h.response({
		status: "success",

		data: {
			books: books.map((book) => ({
				id: book.id,
				name: book.name,
				publisher: book.publisher,
			})),
		},
	});
	response.code(200);
	return response;
};

const getBookById = (request, h) => {
	const { bookId } = request.params;

	const book = books.filter((i) => i.id === bookId)[0];

	if (book !== undefined) {
		return {
			status: "success",
			data: {
				book,
			},
		};
	}
	const response = h.response({
		status: "fail",
		message: "Buku tidak ditemukan",
	});
	response.code(404);
	return response;
};

const editBookById = (request, h) => {
	const { bookId } = request.params;

	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload;

	const updatedAt = new Date().toISOString();

	if (name == "" || name === undefined) {
		const response = h.response({
			status: "fail",
			message: "Gagal memperbarui buku. Mohon isi nama buku",
		});
		response.code(400);
		return response;
	}

	if (readPage > pageCount) {
		const response = h.response({
			status: "fail",
			message:
				"Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
		});
		response.code(400);
		return response;
	}

	const index = books.findIndex((i) => i.id === bookId);

	if (index !== -1) {
		books[index] = {
			...books[index],
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		};

		const response = h.response({
			status: "success",
			message: "Buku berhasil diperbarui",
		});
		response.code(200);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Gagal memperbarui buku. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

const deleteBookById = (request, h) => {
	const { bookId } = request.params;

	const index = books.findIndex((i) => i.id === bookId);

	if (index !== -1) {
		books.splice(index, 1);
		const response = h.response({
			status: "success",
			message: "Buku berhasil dihapus",
		});
		response.code(200);
		return response;
	}
	const response = h.response({
		status: "fail",
		message: "Buku gagal dihapus. Id tidak ditemukan",
	});
	response.code(404);
	return response;
};

module.exports = {
	addNewBook,
	getAllBooks,
	getBookById,
	editBookById,
	deleteBookById,
};
