-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "subject_code" VARCHAR(255) NOT NULL,
    "semester" VARCHAR(255) NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "note_upvote" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "note_id" INTEGER NOT NULL,

    CONSTRAINT "note_upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_review" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "comment" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL,

    CONSTRAINT "course_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_review_upvote" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "course_review_id" INTEGER NOT NULL,

    CONSTRAINT "course_review_upvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pyq" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "subject_code" VARCHAR(255) NOT NULL,
    "branch" VARCHAR(255) NOT NULL,
    "semester" VARCHAR(100) NOT NULL,
    "instructor_id" INTEGER NOT NULL,
    "anonymous" BOOLEAN NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pyq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pyq_upvote" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "pyq_id" INTEGER NOT NULL,

    CONSTRAINT "pyq_upvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subject_id_key" ON "subject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_id_key" ON "instructor"("id");

-- CreateIndex
CREATE UNIQUE INDEX "note_id_key" ON "note"("id");

-- CreateIndex
CREATE UNIQUE INDEX "note_upvote_id_key" ON "note_upvote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "note_upvote_user_id_note_id_key" ON "note_upvote"("user_id", "note_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_id_key" ON "course"("id");

-- CreateIndex
CREATE UNIQUE INDEX "course_instructor_id_code_key" ON "course"("instructor_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "course_review_id_key" ON "course_review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "course_review_user_id_course_id_key" ON "course_review"("user_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "course_review_upvote_id_key" ON "course_review_upvote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "course_review_upvote_user_id_course_review_id_key" ON "course_review_upvote"("user_id", "course_review_id");

-- CreateIndex
CREATE UNIQUE INDEX "pyq_id_key" ON "pyq"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pyq_upvote_id_key" ON "pyq_upvote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pyq_upvote_user_id_pyq_id_key" ON "pyq_upvote"("user_id", "pyq_id");

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_subject_code_fkey" FOREIGN KEY ("subject_code") REFERENCES "subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_upvote" ADD CONSTRAINT "note_upvote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "note_upvote" ADD CONSTRAINT "note_upvote_note_id_fkey" FOREIGN KEY ("note_id") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review" ADD CONSTRAINT "course_review_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review_upvote" ADD CONSTRAINT "course_review_upvote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_review_upvote" ADD CONSTRAINT "course_review_upvote_course_review_id_fkey" FOREIGN KEY ("course_review_id") REFERENCES "course_review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyq" ADD CONSTRAINT "pyq_subject_code_fkey" FOREIGN KEY ("subject_code") REFERENCES "subject"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyq" ADD CONSTRAINT "pyq_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyq" ADD CONSTRAINT "pyq_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyq_upvote" ADD CONSTRAINT "pyq_upvote_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pyq_upvote" ADD CONSTRAINT "pyq_upvote_pyq_id_fkey" FOREIGN KEY ("pyq_id") REFERENCES "pyq"("id") ON DELETE CASCADE ON UPDATE CASCADE;
