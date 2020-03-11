-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 192.168.2.8
-- Generation Time: 2020-03-11 16:49:12
-- 服务器版本： 10.2.12-MariaDB-log
-- PHP Version: 5.6.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `one_db`
--

-- --------------------------------------------------------

--
-- 表的结构 `fa_form`
--

CREATE TABLE `fa_form` (
  `id` int(10) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `text` text DEFAULT NULL,
  `scope_id` int(10) NOT NULL DEFAULT 0 COMMENT '作用域ID',
  `data_id` int(10) NOT NULL DEFAULT 0 COMMENT '数据源ID',
  `atime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `fa_scope`
--

CREATE TABLE `fa_scope` (
  `id` int(10) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `scope` longtext DEFAULT NULL,
  `open` int(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  `atime` timestamp NOT NULL DEFAULT current_timestamp(),
  `allscope` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `fa_scopes`
--

CREATE TABLE `fa_scopes` (
  `id` int(10) NOT NULL,
  `idx` int(10) NOT NULL DEFAULT 0,
  `sid` int(10) NOT NULL DEFAULT 0 COMMENT '上级scopeID',
  `name` varchar(200) DEFAULT NULL,
  `typex` varchar(100) DEFAULT NULL,
  `atime` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `fa_form`
--
ALTER TABLE `fa_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fa_scope`
--
ALTER TABLE `fa_scope`
  ADD PRIMARY KEY (`id`),
  ADD KEY `open` (`open`),
  ADD KEY `allscope` (`allscope`);
ALTER TABLE `fa_scope` ADD FULLTEXT KEY `scope` (`scope`);

--
-- Indexes for table `fa_scopes`
--
ALTER TABLE `fa_scopes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx` (`idx`),
  ADD KEY `typex` (`typex`),
  ADD KEY `sid` (`sid`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `fa_form`
--
ALTER TABLE `fa_form`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `fa_scope`
--
ALTER TABLE `fa_scope`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `fa_scopes`
--
ALTER TABLE `fa_scopes`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;
