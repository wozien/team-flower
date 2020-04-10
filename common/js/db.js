const db = wx.cloud.database();

export const getCollection = name => {
	return db.collection(name);
}

export const getDoc = obj => {
	return this.getCollection(obj.name).doc(obj.doc);
}